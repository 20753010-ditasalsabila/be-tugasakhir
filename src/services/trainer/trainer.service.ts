import { Trainer } from "@models/trainer/trainer.entity";
import { Injectable, UnprocessableEntityException, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { CreateTrainerDto } from "src/dtos/trainer/trainer.dto";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class TrainerService {
    constructor(@InjectRepository(Trainer) private trainerRepository : Repository<Trainer>) {}

    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Trainer>> {
        const qb = this.trainerRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.fullname LIKE :term', { term });
        }
        qb.orderBy('q.id', 'DESC');
        // qb.orderBy('q.fullname', 'ASC');

        
    
        return paginate<Trainer>(qb, options)
    }

    findAll() {
        return this.trainerRepository.find()
    }

    
    findOne(id : number) {
        return this.trainerRepository.findOne({where: {id}})
    }

    async findByFullname(fullname : string) {
        return await this.trainerRepository.findOne({where: {fullname}})
    }

    async findByEmail(email : string) {
        return await this.trainerRepository.findOne({where: {email}})
    }

   async validate(fullname, email, id? : number) {
        const data = await this.findByFullname(fullname)
        const data2 = await this.findByEmail(email) 

        if (data && data.id != id) {
            throw new UnprocessableEntityException(`This Fullname already exists`)
        }
        if (data2 && data2.id != id) {
            throw new UnprocessableEntityException(`This E-mail already exists`)
        }
    }


    async create(data : CreateTrainerDto) {
        
        await this.validate(data.fullname,data.email) 
        
        const trainer  = new Trainer();

        trainer.fullname = data.fullname;
        trainer.email = data.email;

        return this.trainerRepository.save(trainer)
    }

    async update(data : CreateTrainerDto, id: number) {
        await this.validate(data.fullname, data.email, id) 

        return this.trainerRepository.save({...data, id: Number (id)})
    }

    async delete(id: number) :Promise<DeleteResult> {
        return await this.trainerRepository.delete(id)
    }
}
