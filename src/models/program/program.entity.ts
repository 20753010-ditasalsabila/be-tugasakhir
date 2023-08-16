import { Assesment } from "@models/assesment/assesment.entity";
import { Courses } from "@models/course/course.entity";
import { WeightCriteria } from "@models/criteria/criteria-weight.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Detail } from "@models/criteria/detail.criteria.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Program {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique : true})
    name: string;
    
    @Column({type : 'date'})
    start_date: string;

    @Column({type : 'date'})
    end_date: string;

    @Column()
    type: string;

    @Column()
    batch: number;

    @Column()
    instructor_coordinator : string;
    
    @Column()
    first_instructor : string;

    @Column()
    second_instructor : string;

    @ManyToMany(() => Courses, (course) => course.programs)
    @JoinTable({
        name: 'program_has_courses',
        joinColumn: { name: 'program_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' }
    })
    courses: Courses[];


    @OneToMany(() => WeightCriteria, (weight) => weight.program)
    weightcriteria: WeightCriteria[];

    @OneToMany(()=> Assesment, (assesment) => assesment.programs)
    assesment: Assesment[]

    

    // @OneToMany(() => WeightCriteria, (weight) => weight.program)
    // weight : Promise<WeightCriteria[]>


}

export class FilterCourse {

    id: number;
    course_name: string;
    start_date: Date;
    end_date: Date;
    type: string;
    batch: number;
    instructor_coordinator : string;
    first_instructor : string;
    second_instructor : string; 

}
