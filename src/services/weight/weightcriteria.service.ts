import { WeightCriteria } from "@models/criteria/criteria-weight.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CriteriaService } from "@services/criteria/criteria.service";
import { ProgramService } from "@services/program/program.service";
import { triggerAsyncId } from "async_hooks";
import { CreateWeightDto } from "src/dtos/weight/weight.dto";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class WeightCriteriaService {
    constructor(
        @InjectRepository(WeightCriteria) private weighrCriteriaRepository: Repository<WeightCriteria>,
        private criteriaService : CriteriaService,
        @Inject(forwardRef(() => ProgramService)) private readonly programService : ProgramService
    ){}

    async findOne(id : number) {
        return await this.weighrCriteriaRepository.findOneOrFail({where: {id}})
    }
    
    async findAllWeight() {
        const cehck = await this.weighrCriteriaRepository.find({relations : ['criteriaId','program']})
        console.log(cehck);
        
    }


    async create(data : CreateWeightDto ): Promise<WeightCriteria> {

        const weight = new WeightCriteria()
    
        weight.weight = data.weight;
        

        const getId = await this.programService.findOneByIds(data.programId)
        weight.program = getId

        const oneCriteria = await this.criteriaService.findOne(data.criteriaId);
        weight.criteriaId = oneCriteria


        return await this.weighrCriteriaRepository.save(weight)
    }

    async update(data : CreateWeightDto): Promise<WeightCriteria> {

        const weight = new WeightCriteria()

        weight.id = data.id
        weight.weight = data.weight;
        

        const getId = await this.programService.findOneByIds(data.programId)
        weight.program = getId

        const oneCriteria = await this.criteriaService.findOne(data.criteriaId);
        weight.criteriaId = oneCriteria

        return await this.weighrCriteriaRepository.save(weight)

    }

    async findRelationProgram(id: number){
        return await this.weighrCriteriaRepository.find({where: {program: {id}}, relations: ['program']})
    }

    async delete(id : number): Promise<DeleteResult> {
        // const getId = await this.weighrCriteriaRepository.findOne({where: {id}})
        return this.weighrCriteriaRepository.softDelete({id})
    }
}