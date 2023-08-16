import { Detail } from "@models/criteria/detail.criteria.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

export class DetailCriteriaDto{
    @IsNotEmpty()
    programId: number;

    @IsNotEmpty()
    item: string;

    @IsNotEmpty()
    weight: string;

    @IsNotEmpty()
    score: number;

    @IsNotEmpty()
    final_score: number;

    constructor(detail?: Detail) {
        this.programId = detail.programId;
        this.item = detail.item;
        this.weight = detail.weight;
        this.score = detail.score;
        this.final_score = detail.final_score;
    }
};