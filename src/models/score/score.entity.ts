import { Assesment } from "@models/assesment/assesment.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class Score {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    criteria_name: string;

    @Column('decimal', { precision: 5, scale: 2 })
    scores: number

    @Column()
    weight: string;

    @ManyToOne(() => Assesment, assesment => assesment.scores, {onDelete: "CASCADE"})
    assesment: Assesment; 

    @DeleteDateColumn()
    deletedAt?: Date;
    

}
