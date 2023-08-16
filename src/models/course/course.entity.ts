import { Assesment } from "@models/assesment/assesment.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Program } from "@models/program/program.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('courses')
export class Courses {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    course_name: string;

    @Column()
    programming_language: string;
    
    @Column()
    framework: string;

    @ManyToMany(()=> Program, (program) => program.courses)
    programs: Promise<Program[]>


    @OneToMany(()=> Assesment, (assesment) => assesment.courses)
    assesment: Assesment[]

    

    // @ManyToOne(()=> Program, (program) => program.courses)
    // courses: Courses[]

     // @CreateDateColumn()
    // created_at: Date;
}

export class FilterCourses {
    
    id: number;
    course_name: string;
    programming_language: string;
    framework: string;
}