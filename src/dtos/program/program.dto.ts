import { Courses } from "@models/course/course.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Expose, Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { DetailCriteriaDto } from "../criteria/detail-criteria.dto";
import { CreateWeightDto } from "../weight/weight.dto";

export class CreateCourseDto {

    @IsOptional()
    id?: number

    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    start_date: string;
    
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    end_date: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    batch: number;

    @IsNotEmpty()
    instructor_coordinator : string; 

    @IsOptional()
    first_instructor : string; 

    @IsOptional()
    second_instructor : string; 

    @IsNotEmpty()
    courses: Courses[];

    @IsNotEmpty()
    weightcriteria: CreateWeightDto[];


}