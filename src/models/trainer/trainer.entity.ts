import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trainer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string ;

    @Column()
    email: string ;

    @CreateDateColumn()
    created_at: Date;

}

export class FilterTrainer {
    id: number;
    fullname: string;
    email: string;
}
