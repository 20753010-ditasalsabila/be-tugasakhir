import { Type } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsNumber, Length } from "class-validator";

//input request
export class CreateTraineeDto {

    @IsNotEmpty()
    fullname: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    phone: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    instance: string;

    @IsNotEmpty()
    major: string;


    
}





// export enum GenderType {
//     Male,
//     Female,
// }

// export class Profile {
//     @IsEnum(GenderType) gender: string;
// }

// export class CreateClientDto {
//     @Length(1) first_name: string;

//     @Length(1) last_name: string;

//     @IsEmail() email: string;

//     @IsObject()
//     @ValidateNested({each: true})
//     @Type(() => Profile)
//     profile: Profile; 


// }



// export class UpdateUserDto {
//     @IsString()
//     id: string;
  
//     @Length(2, 50)
//     @IsString()
//     firstName: string;
  
//     @IsOptional()
//     @Length(2, 50)
//     @IsString()
//     middleName?: string;
  
//     @Length(2, 50)
//     @IsString()
//     lastName: string;
  
//     @IsEmail()
//     @Max(255)
//     email: string;
  
//     @Length(8, 50)
//     password: string;
  
//     @IsDateString()
//     dateOfBirth: string | Date;
//   }