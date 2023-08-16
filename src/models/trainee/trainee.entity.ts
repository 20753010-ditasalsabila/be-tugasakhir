import { Assesment } from "@models/assesment/assesment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trainee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique : true})
    fullname: string;
    
    @Column({unique : true})
    email: string;

    @Column()
    gender: string;
    
    @Column()
    phone: string;

    @Column()
    city: string;

    @Column()
    instance: string;

    @Column()
    major: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=> Assesment, (assesment) => assesment.trainee)
    assesment: Assesment[]


}


export class FilterTrainee {
    
    id: number;    
    fullname: string;
    email: string;
    gender: string;
    phone: number;
    city: string;
    instance: string;
    major: string;
    stack: string;
    project: string;
    created_at: Date;


}
// trainer { 

//     respon;
    
//     id
//     fullname
//     emai
//     gender
//     phone
    
//     request;
    
//     id
//     fullname 
//     gender
//     phone
//     city
//     schhool/univ
//     major
//     stack
//     project
    
//     }
    
    