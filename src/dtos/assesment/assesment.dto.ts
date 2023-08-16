import { Program } from "@models/program/program.entity";
import { IsNotEmpty, IsOptional } from "class-validator";
import { DetailCriteriaDto } from "../criteria/detail-criteria.dto";
import { CreateCourseDto } from "../program/program.dto";
import { Score } from "@models/score/score.entity";
import { Courses } from "@models/course/course.entity";

export class CreateAssesmentDto {

    @IsNotEmpty()
    trainee: number;

    @IsNotEmpty()
    programs: number;

    @IsNotEmpty()
    scores: Score[]

    @IsNotEmpty()
    courses : number

    @IsNotEmpty()
    final_score: number;

    @IsOptional()
    instructor_coordinator : string
    
    @IsOptional()
    first_instructor : string

    @IsOptional()
    second_instructor : string

       

}
   
