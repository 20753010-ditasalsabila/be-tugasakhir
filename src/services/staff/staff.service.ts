import { Staff } from "@models/staff/staff.entity";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateStaffDto,} from "src/dtos/staff/staff.dto";
import { DeleteResult, Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { ClassSerializerInterceptor, UnprocessableEntityException, UseInterceptors } from "@nestjs/common";
import { async } from "crypto-random-string";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";


@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
export class StaffService {
    constructor(@InjectRepository(Staff) private readonly staffRepository:Repository<Staff>) {}


    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Staff>> {
        const qb = this.staffRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.fullname LIKE :term', { term });
        }
        qb.orderBy('q.id', 'ASC');
    
    
        return paginate<Staff>(qb, options)
    }

    
    findOne(id : number){
        return this.staffRepository.findOneOrFail({where: {id}})
    }

    async findByUsername(username: string) {
        return await this.staffRepository.findOne({
            where : {username}
        })
    }

    async findByEmail(email : string) {
        return await this.staffRepository.findOne({where: {email}})
    }

    async validates(username, email) {
        const data = await this.findByUsername(username)
        const data2 = await this.findByEmail(email) 

        if (data) {
            throw new UnprocessableEntityException(`This username already exists`)
        }
        if (data2 ) {
            throw new UnprocessableEntityException(`This E-mail already exists`)
        }
    }

    async create(data : CreateStaffDto ){

        await this.validates(data.username, data.email)

        
        const salt = 10; // salt password
        const staff = new Staff();
        
        staff.fullname = data.fullname;
        staff.email = data.email;
        staff.username = data.username;
        //hash password create data
        staff.password = await bcrypt.hash(data.password, salt)

        console.log(Staff);
        

       
        return this.staffRepository.save(staff)
    }

    async update(data : CreateStaffDto, id: number) {
        await this.validates(data.username, data.email)


        //hash password update data
        const salt = await bcrypt.genSalt()
        data.password = await bcrypt.hash(data.password, salt)

        return this.staffRepository.save({ ...data, id: Number (id)})
    }
    

    async delete(id: number) : Promise<DeleteResult> {
        return await this.staffRepository.delete(id)
    }


    

}






// findAll() {
//     return this.stafRepository.find()
//     // map((staf) => plainToClass(FilerStaff, staf));
// }
