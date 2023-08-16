import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateScoreDto {
    @IsOptional()
    id?: number
    
    @IsOptional()
    criteria_name: string

    @IsNotEmpty()
    scores: number

    @IsOptional()
    weight: string

    @IsNotEmpty()
    assesmentId: number
}