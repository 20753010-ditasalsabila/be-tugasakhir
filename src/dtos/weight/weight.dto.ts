import { WeightCriteria } from "@models/criteria/criteria-weight.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Program } from "@models/program/program.entity";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateWeightDto {
    @IsOptional()
    id?: number

    @IsNotEmpty()
    weight: string;

    @IsNotEmpty()
    criteriaId: number;

    @IsOptional()
    programId: number;



}