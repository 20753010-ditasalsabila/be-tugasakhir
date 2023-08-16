import { Column, DeleteDateColumn, Entity, IsNull, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Criteria } from "./criteria.entity";
import { Program } from "@models/program/program.entity";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

@Entity()
export class WeightCriteria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    weight: string;

    @ManyToOne(() => Criteria, (criteria) => criteria.criteriaId)
    criteriaId : Criteria;
    
    @ManyToOne(() => Program, program => program.weightcriteria,{onDelete: "CASCADE"})
    program: Program; 

    @DeleteDateColumn()
    deletedAt?: Date;


    
}