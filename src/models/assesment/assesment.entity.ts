import { Courses } from "@models/course/course.entity";
import { Detail } from "@models/criteria/detail.criteria.entity";
import { Program } from "@models/program/program.entity";
import { Score } from "@models/score/score.entity";
import { Trainee } from "@models/trainee/trainee.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assesment {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => Trainee, (trainee) => trainee.assesment)
    trainee : Trainee;

    @ManyToOne(() => Program, (program) => program.assesment)
    programs: Program;

    @ManyToOne(() => Courses, (course) => course.assesment)
    courses: Courses;

    @OneToMany(() => Score, (score) => score.assesment)
    scores: Score[];

    @Column('decimal', { precision: 5, scale: 2 })
    final_score : number;

    @Column()
    instructor_coordinator : string
    
    @Column()
    first_instructor : string

    @Column()
    second_instructor : string
}

export class FilterAssesment {
    id : number;
    trainee : string
    program : string
    
}