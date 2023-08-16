import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Criteria } from "./criteria.entity";
import { Program } from "@models/program/program.entity";
import { Assesment } from "@models/assesment/assesment.entity";

@Entity()
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    item: string;

    @Column()
    weight: string;

    @Column()
    score: number;

    @Column()
    final_score: number;

    @Column()
    programId: number
    
    // @ManyToOne(() => Assesment, (assesment) => assesment.detailcriteria)
    // assesment: Assesment;

}