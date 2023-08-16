import { Exclude } from "class-transformer";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { CreateStaffDto } from "src/dtos/staff/staff.dto";

// table staff
@Entity()
export class Staff  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column({unique : true})
    email: string;
    
    @Column({unique : true})    
    username: string;
    
    @Column()
    password : string;

    @CreateDateColumn()
    created_at: Date;

    async validatePassword(passord: string): Promise<boolean> {
        return bcrypt.compare(passord, this.password)
    }
 
    

}

// untuk respon inputan

export class FilerStaff{
    
    id : number;
    fullname: string;
    email: string;
    username: string;

    @Exclude()   //==> tanpa password
    password: string;

    created_at: Date;

}

