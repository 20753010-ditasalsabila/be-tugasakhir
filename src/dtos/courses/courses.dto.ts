import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCoursesDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    course_name: string;

    @IsNotEmpty()
    programming_language: string;
    
    @IsNotEmpty()    
    framework: string;

    // @IsNotEmpty()    
    // coursesId?: number;
}