import { Courses } from "@models/course/course.entity";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { CreateCoursesDto } from "src/dtos/courses/courses.dto";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class CoursesService {
    constructor(@InjectRepository(Courses) private readonly coursesRepository : Repository<Courses>) {}

    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Courses>> {
        const qb = this.coursesRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.course_name LIKE :term', { term });
        }
        qb.orderBy('q.id', 'DESC');
    
    
        return paginate<Courses>(qb, options)
    }

    async findOneByIds(id : number) {
        return await this.coursesRepository.findOneOrFail({where: {id}})
    }


    findAll() {
        return this.coursesRepository.find()
    }

    findOne(id : number) {
        return this.coursesRepository.findOneOrFail({where: {id}})
    }

    async findByCourse(course_name : string) {
        return await this.coursesRepository.findOne({where: {course_name}})
    }

    async validate(course_name, id? : number) {
        const data = await this.findByCourse(course_name)
        if (data && data.id != id) {
            throw new UnprocessableEntityException(`This Course already exists`)
        }
    }

    async create(data : CreateCoursesDto) {

        await this.validate(data.course_name)

        const courses = new Courses();

        courses.course_name = data.course_name;
        courses.programming_language = data.programming_language;
        courses.framework = data.framework;

        return this.coursesRepository.save(courses)

    }

    async update(data : CreateCoursesDto, id: number) {
        await this.validate(data.course_name, id)
        return this.coursesRepository.save({...data, id: Number (id)})
    }

    async delete(id: number) :Promise<DeleteResult> {
        return await this.coursesRepository.delete(id)
    }
}

// async paginate(options : IPaginationOptions, params : {term?: string, order?: string, sort?: 'ASC'|'DESC'} ) : Promise<Pagination<Courses>> {
//     const qb = this.coursesRepository.createQueryBuilder('q');
//     const term = `%${params.term.trim()}%`;
    
//     if (params.order || params.sort) {
//         qb.orderBy(`q.${params.order}`, params.sort);
//     } 

//     if (term) {
//         qb.where('q.course_name LIKE :term', { term });
//     }  

//     return paginate<Courses>(qb, options)
// }