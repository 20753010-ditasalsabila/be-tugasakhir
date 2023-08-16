// import { Weight } from "@models/weight/weight.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCriteriaDto {

    @IsNotEmpty()
    code : string

    @IsNotEmpty()
    criteria_name: string



    
    
}