import { Exclude, Transform } from "class-transformer";
import { IsEmail, IsLowercase, IsNotEmpty, IsOptional, IsUppercase, MinLength } from "class-validator";
import { isLowerCase } from "voca";

//input request
export class CreateStaffDto{

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

}


