import { Detail } from "@models/criteria/detail.criteria.entity";
import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DetailCriteriaDto } from "src/dtos/criteria/detail-criteria.dto";
import { Repository } from "typeorm";
import { CriteriaService } from "./criteria.service";
import { ProgramService } from "@services/program/program.service";

@Injectable()
export class DetailCriteriaService {
    constructor(
        @InjectRepository(Detail) private detailCriteriaRepository: Repository<Detail>,
        private readonly criteriaService : CriteriaService,
        private readonly programService : ProgramService
    ){}

    async findOne(id : number) {
        return this.detailCriteriaRepository.findOne({where: {id}})
    }

    // async findByIds(id: number[]) {
    //     return this.detailCriteriaRepository.findByIds(id,
    //         {relations: ['criteria']})
    // }

    async findByProgramId(programId: number) {
        return this.detailCriteriaRepository.find({where: {programId}});
    }

    async create(data : DetailCriteriaDto) {

       const detail = new Detail()
       
       detail.item = data.item
       detail.weight = data.weight
       detail.score = data.score
       detail.final_score = data.final_score
       detail.programId = data.programId;

       const result = await this.detailCriteriaRepository.save(detail);

    //    return new DetailCriteriaDto(result);
    return result;
    }   
}