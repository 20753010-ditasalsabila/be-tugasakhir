import { Courses } from "@models/course/course.entity";
import { WeightCriteria } from "@models/criteria/criteria-weight.entity";
import { Criteria } from "@models/criteria/criteria.entity";
import { Program} from "@models/program/program.entity";
import { Trainee } from "@models/trainee/trainee.entity";
import { Inject, Injectable, NotFoundException, UnprocessableEntityException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CoursesService } from "@services/courses/courses.service";
import { CriteriaService } from "@services/criteria/criteria.service";
import { WeightCriteriaService } from "@services/weight/weightcriteria.service";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { CreateCourseDto } from "src/dtos/program/program.dto";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import { includes } from "voca";

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Program) private programRepository: Repository<Program>,
        private readonly coursesService: CoursesService,
        private readonly criteriaService: CriteriaService,
        private readonly weightCriteriaService: WeightCriteriaService,
        // @Inject(forwardRef(() => ProgramService)) private readonly programService : ProgramService
        ) {}


    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Program>> {
        const qb = this.programRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.name LIKE :term', { term });
        }
        qb.orderBy('q.id', 'DESC');
    
    
        return paginate<Program>(qb, options)
    }


    findAllProgram() {
        return this.programRepository.find()
    }


    async findAll() {
        const query: SelectQueryBuilder<Program> = 
        
        this.programRepository.createQueryBuilder('p');
        query.leftJoinAndSelect('p.courses', 'courses')
        query.leftJoinAndSelect('p.weightcriteria', 'weightcriteria')
        .select(['p', 'courses.id', 'courses.course_name', 'courses.programming_language','courses.framework',])
        .select(['p','weightcriteria.id','weightcriteria.weight','weightcriteria.criteriaId','weightcriteria.program'])
        .getMany()

        const program = await query.getMany();
        // console.log('program => ', program);

        
        const result = await this.programRepository.find({
            relations: ['courses','weightcriteria','weightcriteria.criteriaId']
            });
            
        
        return result;
    }

    async findOneByIds(id : number) {
        return await this.programRepository.findOneOrFail({where: {id}})
    }

    async findOne(id : number){
        const query: SelectQueryBuilder<Program> = 
        
        this.programRepository.createQueryBuilder('p');
        query.leftJoinAndSelect('p.courses', 'courses');
        query.leftJoinAndSelect('p.weightcriteria', 'weightcriteria')
        .select(['p', 'courses.id', 'courses.course_name', 'courses.programming_language','courses.framework'])
        .select(['p', 'weightcriteria.id', 'weightcriteria.weight'])
        .getOne()

        const result = await query.getOne();
        // console.log('RESULT => ', result);
        
        return this.programRepository.findOneOrFail({
            where: {id}, relations: ['courses','weightcriteria','weightcriteria.criteriaId'
        ]});
        // return this.programRepository.findOneOrFail(id)
    }

    async findByNameProgram(name : string) {
        return await this.programRepository.findOne({where: {name}})
    }

    async validate(name , id? : number) {
        const data = await this.findByNameProgram(name) 

        if (data && data.id != id) {
            throw new UnprocessableEntityException(`This Program already exists`)
        }
    }


    async create(data : CreateCourseDto) {

        await this.validate(data.name)

        const tempCourses: Courses[] = [];
        const course = new Program();

        course.name = data.name;
        course.start_date = data.start_date;
        course.end_date = data.end_date;
        course.type = data.type;
        course.batch = data.batch;
        course.instructor_coordinator = data.instructor_coordinator;
        course.first_instructor = data.first_instructor;
        course.second_instructor = data.second_instructor

        const programs = await this.programRepository.save(course)
    
        if (data.courses.length > 0 ) {
            for (const course of data.courses) {
                const oneCourse = await this.coursesService.findOne(course.id);
                if (oneCourse) {
                    tempCourses.push(oneCourse);
                } else {
                    throw new NotFoundException(`Data Course dengan ID ${course.id} tidak ditemukan`);
                }
            }
        }   

        
        const weightCriteria: WeightCriteria[] = []

        for (const weCriteria of data.weightcriteria) {

            const result = await this.weightCriteriaService.create({...weCriteria, programId: programs.id})
            weightCriteria.push(result)
            
        }

        const result = await this.programRepository.save({
            ...weightCriteria,
            courses: await Promise.resolve(tempCourses),
            ...course,
            
        });
        return result;
    }

    async update(data : CreateCourseDto, id: number) {

        const tempCourses: Courses[] = [];

        const course = await this.programRepository.findOne({where: {id}})



        course.name = data.name;
        course.start_date = data.start_date;
        course.end_date = data.end_date;
        course.type = data.type;
        course.batch = data.batch;
        course.instructor_coordinator = data.instructor_coordinator;
        course.first_instructor = data.first_instructor;
        course.second_instructor = data.second_instructor
        
        await this.validate(data.name, id)


        const programs = await this.programRepository.save(course)

        const tempWeighcriteria = await this.weightCriteriaService.findRelationProgram(programs.id)

        if (tempWeighcriteria.length > 0) {
            const idDeleted = tempWeighcriteria.filter(x => !data.weightcriteria.some(x2 => x.id == x2.id));
            idDeleted.forEach(x => this.weightCriteriaService.delete(x.id));

            for (const weight of tempWeighcriteria) {
                if (data.weightcriteria.length == 0 ) {
                    this.weightCriteriaService.delete(weight.id)
                }
            }

        }
    
        if (data.courses.length > 0 ) {
            for (const value of data.courses) {
                const oneCourse = await this.coursesService.findOne(value.id);
                if (oneCourse) {
                    tempCourses.push(oneCourse);
                } else {
                    throw new NotFoundException(`Data Course dengan ID ${value.id} tidak ditemukan`);
                }
            }
        }

        
        const weightCriteria: WeightCriteria[] = []

        for (const weCriteria of data.weightcriteria) {

            const getId = await weCriteria.id
            console.log('ID WEIGHT ==>',getId);
            
        
            const result = await this.weightCriteriaService.update({...weCriteria, programId: programs.id})
            weightCriteria.push(result)
            
        }


        

        const result = await this.programRepository.save({
            ...weightCriteria,
            courses: await Promise.resolve(tempCourses),
            ...course,
            id: Number (id),
            
            
        });
        return result;


    }

    async delete(id : number): Promise<DeleteResult> {
        return await this.programRepository.delete({id})
    }
}



//  async create(data : CreateCourseDto) {
        
//         const course = new Program();

//         course.name = data.name;
//         course.start_date = data.start_date;
//         course.end_date = data.end_date;
//         course.type = data.type;
//         course.batch = data.batch;
//         course.instructor_coordinator = data.instructor_coordinator;
//         course.first_instructor = data.first_instructor;
//         course.second_instructor = data.second_instructor

//         return this.programRepository.save(course)
//     }






