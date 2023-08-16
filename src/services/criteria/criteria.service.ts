import { Criteria } from "@models/criteria/criteria.entity";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Validate } from "class-validator";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
// import { WeightService } from "@services/weight/weight.service";
import { CreateCriteriaDto } from "src/dtos/criteria/criteria.dto";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class CriteriaService {
    constructor(@InjectRepository(Criteria) private criteriaRepository : Repository<Criteria>,
    // private readonly weightService: WeightService
    ) {}
    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Criteria>> {
        const qb = this.criteriaRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.criteria_name LIKE :term', { term });
        }
        qb.orderBy('q.id', 'DESC');
    
    
        return paginate<Criteria>(qb, options)
    }
    
    findAll() {
        return this.criteriaRepository.find()
    }

    
    findOne(id: number) {
        return this.criteriaRepository.findOneOrFail({where: {id}})
    }

    async findByCriteriaName(criteria_name : string) {
        return await this.criteriaRepository.findOne({where: {criteria_name}})
    }

    async findByCode(code : string) {
        return await this.criteriaRepository.findOne({where: {code}})
    }

    async validate(criteria_name, code, id? : number ) {
    
        const name = await this.findByCriteriaName(criteria_name)
        const codes = await this.findByCode(code)   

        if (name && name.id != id) {
            throw new UnprocessableEntityException(`This Criteria Name already exists`)
        }
        if (codes && codes.id != id) {
            throw new UnprocessableEntityException(`This code already exists`)
        }
    }


    async create(data : CreateCriteriaDto) {

        await this.validate(data.criteria_name, data.code)
        
        const criteria  = new Criteria();

        criteria.code = data.code
        criteria.criteria_name = data.criteria_name;

        return this.criteriaRepository.save(criteria)
    }

    async update(data : CreateCriteriaDto, id: number) {
        await this.validate(data.criteria_name, data.code, id)


        return this.criteriaRepository.save({...data, id: Number (id)})
    }

    async delete(id: number) :Promise<DeleteResult> {
        return await this.criteriaRepository.delete(id)
    }
}

// const query : SelectQueryBuilder<Criteria> =

//         this.criteriaRepository.createQueryBuilder('p');
//         query.leftJoinAndSelect('p.weight','weight')
//         .select(['p','weight'])
//         .getMany()

//         return this.criteriaRepository.find({
//             relations: ['weight']
//         })


// const tempWeight: Weight[] = []

//         const criteria  = new Criteria();

//         criteria.code = data.code
//         criteria.criteria_name = data.criteria_name;

//         if (data.weight.length > 0 ) {
//             for (const course of data.weight) {
//                 const oneCourse = await this.weightService.findOne(course.id);
//                 if (oneCourse) {
//                     tempWeight.push(oneCourse);
//                 } else {
//                     throw new NotFoundException(`Data Course dengan ID ${course.id} tidak ditemukan`);
//                 }
//             }
//         }

//         const result = await this.criteriaRepository.save({
//             weight : await Promise.resolve(tempWeight),
//             ...criteria
//         })