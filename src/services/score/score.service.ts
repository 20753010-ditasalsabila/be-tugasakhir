import { Score } from "@models/score/score.entity";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssesmentService } from "@services/assesment/assesment.service";
import { CreateScoreDto } from "src/dtos/score/score.dto";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class ScoreService {
    constructor(@InjectRepository(Score) private scoreRespository: Repository<Score>,
    @Inject(forwardRef(() => AssesmentService)) private assesmentService : AssesmentService,
    ){}

    async findRelationAsesment(id: number){
        return await this.scoreRespository.find({where: {assesment: {id}}, relations: ['assesment']})
    }


    async create(data : CreateScoreDto) {
        const score = new Score()

        score.criteria_name = data.criteria_name;
        score.scores = data.scores
        score.weight = data.weight

        
        const getId = await this.assesmentService.findOneByIds(data.assesmentId)
        score.assesment = getId

        return await this.scoreRespository.save(score)
    }

    async update(data : CreateScoreDto) {
        const score = new Score()

        score.id = data.id
        score.criteria_name = data.criteria_name;
        score.scores = data.scores
        score.weight = data.weight

        
        const getId = await this.assesmentService.findOneByIds(data.assesmentId)
        score.assesment = getId

        return await this.scoreRespository.save(score)
    }


    async delete(id : number): Promise<DeleteResult> {
        const getId = await this.scoreRespository.findOne({where: {id}})
        return this.scoreRespository.softDelete({id})
    }
}