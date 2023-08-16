import { Program } from "@models/program/program.entity";
// import { Weight } from "@models/weight/weight.entity";
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, OneToOne } from "typeorm";
import { Detail } from "./detail.criteria.entity";
import { WeightCriteria } from "./criteria-weight.entity";

@Entity()
export class Criteria {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    @Column()
    code: string;

    @Column()
    criteria_name: string ;

    @ManyToMany(()=> Program, (program) => program.courses)
    programs: Promise<Program[]>

    @OneToMany(() => WeightCriteria,(weight) => weight.criteriaId)
    criteriaId : WeightCriteria[];
    
    
}

export class FilterCriteria {
    id: number;
    code : string;
    criteria_name: string;
    
}