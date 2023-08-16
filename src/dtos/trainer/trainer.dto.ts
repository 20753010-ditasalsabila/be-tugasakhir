import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateTrainerDto {
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}