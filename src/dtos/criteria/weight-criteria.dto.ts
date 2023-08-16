import { Criteria } from "@models/criteria/criteria.entity";
import { IsNotEmpty } from "class-validator";

export class WtightCriteriaDto {
    @IsNotEmpty()
    weight : string

    @IsNotEmpty()
    criteriaId : Criteria[]
}