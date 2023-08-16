import { Assesment } from "@models/assesment/assesment.entity";
import { Courses } from "@models/course/course.entity";
import { Detail } from "@models/criteria/detail.criteria.entity";
import { Program } from "@models/program/program.entity";
import { Score } from "@models/score/score.entity";
import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CoursesService } from "@services/courses/courses.service";
import { DetailCriteriaService } from "@services/criteria/detail-Criteria.service";
import { ProgramService } from "@services/program/program.service";
import { ScoreService } from "@services/score/score.service";
import { TraineeService } from "@services/trainee/trainee.service";
import axios from "axios";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { retry } from "rxjs-compat/operator/retry";
import { CreateAssesmentDto } from "src/dtos/assesment/assesment.dto";
import { DetailCriteriaDto } from "src/dtos/criteria/detail-criteria.dto";
import { DeleteResult, Repository, SelectQueryBuilder, createQueryBuilder } from "typeorm";
import * as PdfPrinter from 'pdfmake';

@Injectable()
export class AssesmentService {
    constructor(
        @InjectRepository(Assesment) private assesmentRepository: Repository<Assesment>,
        private readonly prgramService : ProgramService,
        private readonly coursesService : CoursesService,
        private readonly scoreService : ScoreService,
        private readonly traineeService : TraineeService
    ){}
    

    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Assesment>> {
        const qb = this.assesmentRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        
        qb.orderBy('q.id', 'DESC');
        qb.leftJoinAndSelect('q.trainee','trainee')
        qb.leftJoinAndSelect('q.programs','programs');
        qb.leftJoinAndSelect('q.courses','courses');
        if (term) {
            qb.where('trainee.fullname LIKE :term', { term });
        }



    
    
        return paginate<Assesment>(qb, options)
    }

    async paginateReport(options : IPaginationOptions, q = '') : Promise<Pagination<Assesment>> {
        const qb = this.assesmentRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        qb.orderBy('q.id', 'DESC');
        qb.leftJoinAndSelect('q.trainee','trainee')
        if (term) {
            qb.where('trainee.fullname LIKE :term', { term });
        }
        



    
    
        return paginate<Assesment>(qb, options)
    }

    async genpdf(response, id : number) {
        const data = await this.findOne(id)
        const fonts = {
            Times: {
                normal: 'Times-Roman',
                bold: 'Times-Bold',
                italics: 'Times-Italic',
                bolditalics: 'Times-BoldItalic'
            },
        };

        const printer = new PdfPrinter(fonts);
 
        const docDefinition = {
            info: {
                title: `${data.trainee.fullname}_Report.pdf`,
                author: 'Enigma Camp',
                subject: 'Enigma Camp assesment',
                keywords: 'Assesment',
            },
            content: [
                {
                    image: 'enigmacamp.png',
                    width: 150,
                    alignment: 'right',
                    style: 'header',
                    margin: [ 5, 2, 10, 20 ]

                },
                { text:'TRAINING ASSESSMENT', style: 'header', margin: [ 5, 2, 10, 20 ] },
                { text:'Trainee Identity', style: 'bigger' , margin: [ 0, 5]},
                {
                    table: {
                        headerRows: 1,
                        body: [
                            ['Name', ':', `${data.trainee.fullname}`],
                            ['College', ':', `${data.trainee.instance}`],
                            ['Major', ':', `${data.trainee.major}`],
                            ['Email', ':', {text: `${data.trainee.email}`,color: '#23418f'}],
                        ], margin: [ 5, 2]
                    },
                    layout: 'noBorders', margin: [ 5, 2, 10, 20 ]
                },

                { text:'Program', style: 'bigger' , margin: [ 0, 5]},
                {
                    table: {
                        headerRows: 1,
                        body: [
                            ['Program Name', ':', `${data.programs.name}`],
                            ['Course Name', ':', `${data.courses.course_name}`],
                            ['Date', ':', `${data.programs.start_date} - ${data.programs.end_date}`],
                            ['Batch', ':', `${data.programs.batch}`],
                            ['Type', ':', `${data.programs.type}`],
                            ['Instructor Coordinator ', ':', `${data.programs.instructor_coordinator}`],
                            ['Instructor ', ':', `${data.programs.first_instructor}`],
                            ['Instructor ', ':', `${data.programs.second_instructor}`],
                        ], margin: [ 5, 2]
                    },
                    layout: 'noBorders', margin: [ 5, 2, 10, 20 ]
                },

                { text: 'Scoring Criteria', style: 'bigger', margin: [ 0,5] },
                {
                    style: 'tableExample',  
                    table: {
                        // headerRows: 3,
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {text: 'Items ', style: 'tableHeader', fillColor: '#23418f'}, 
                                {text: 'Weight ', style: 'tableHeader', fillColor: '#23418f'}, 
                                {text: 'Score ', style: 'tableHeader', fillColor: '#23418f'}
                            ],
                            [
                                '',
                                '',
                                ''
                            ],
                        ]
                        .concat(data.scores.map((items, i) => 
                        [
                            items.criteria_name, 
                            items['weight']+'%', 
                            items['scores'].toString()
                        ]))
                    },margin: [ 0, 5],alignment: 'center'
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {colSpan: 2, rowSpan: 1, text: 'Final Score :' , style: 'biggers', alignment: 'right', border: [false, false, false, false],},
                                '', 
                                {text:`${data.final_score}`, style: 'biggers', alignment: 'center',fillColor: '#eeffee',border: [false, false, false, true]}],
                        ]
                    },margin: [ 0, 0],alignment: 'center'
                },

                // {text:`Final Score : ${data.final_score}`, style: 'biggers', alignment: 'right'},
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    // characterSpacing: 1

                },
                bigger: {
                    fontSize: 15,
                    bold: true,
                    italics: false,
                    decoration: 'underline',
                    color: '#23418f'
                },
                biggers: {
                    fontSize: 15,
                    bold: true,
                    italics: false,
                },
                table: {
                    fontSize: 12,
                    bold: false,
                    italics: false,
                    // alignment: 'center',
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'white'
                },
                tableExample: {
                    margin: [0, 5, 0, 200]
                },
                
                
            },
            defaultStyle: {
                columnGap: 40,
                font: 'Times'
            }
        };
 
        const options = { 
        }
 
        const chunks = []
        const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
        pdfDoc.on('data', (chunk) => chunks.push(chunk))
        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks)
            response.send(result)
        })
        pdfDoc.end();
        
    }

    async findAll() {
        const query: SelectQueryBuilder<Assesment> =

        this.assesmentRepository.createQueryBuilder('p');
        query.leftJoinAndSelect('p.programs','programs')
        query.leftJoinAndSelect('p.courses','courses')
        query.leftJoinAndSelect('p.scores','scores')
        .select('p','programs.id')
        .select('p','scores.id')
        .select('p','courses.id')
        .getMany()

        const asessments = await query.getMany();
        console.log('asessments => ', asessments);

        return  await this.assesmentRepository.find({
            relations: [
                'programs',
                'programs.courses',
                'programs.weightcriteria',
                'programs.weightcriteria.criteriaId',
                'courses',
                'scores']
        });

    }

    async findOne(id : number) {
        console.log('ini ID >',id );
        
        const query: SelectQueryBuilder<Assesment> =

        this.assesmentRepository.createQueryBuilder('p');
        query.leftJoinAndSelect('p.trainee','trainee')
        query.leftJoinAndSelect('p.programs','programs')
        query.leftJoinAndSelect('p.courses','courses')
        query.leftJoinAndSelect('p.scores','scores')
        .select('p','programs.id')
        .select('p','scores.id')
        .select('p','courses.id')
        .getOne()

        const result = await query.getOne();
        console.log('RESULT => ', result)

        return await this.assesmentRepository.findOneOrFail({
            where: {id}, 
            relations: [
                'trainee',
                'programs',
                'programs.courses',
                'programs.weightcriteria',
                'programs.weightcriteria.criteriaId',
                'courses',
                'scores']
        }
        )
        // return this.assesmentRepository.findOneOrFail({where: {id}})
    }

    // async findByIdTrainee(idtrainee : number){
    //     return await this.assesmentRepository.findOne({where: {idtrainee}})
    // }

    // async findByIdProgram(idprogram : number){
    //     return await this.assesmentRepository.findOne({where: {idprogram}})
    // }

    // async findByIdCourse(idcourse: number){
    //     return await this.assesmentRepository.findOne({where: {idcourse}})
    // }

    // async validate(idtrainee, idprogram, idcourse, id? : number) {
    //     const data = await this.findByIdTrainee(idtrainee)
    //     const data2 = await this.findByIdProgram(idprogram)
    //     const data3 = await this.findByIdCourse(idcourse) 

    //     if (data && data.id != idtrainee || data2 && data2.id != idprogram || data3 && data3.id != idcourse) {
    //         throw new UnprocessableEntityException(`This Fullname already exists`)
    //     }  
    // }

    async findOneByIds(id : number) {
        return await this.assesmentRepository.findOneOrFail({where: {id}})
    }

    async create(data : CreateAssesmentDto) {


        const assesment = new Assesment();

        const getIdTRainee = await this.traineeService.findOneByIds(data.trainee)
        assesment.trainee = getIdTRainee;

        console.log("TRAINEE =.>>>>",getIdTRainee);

        assesment.final_score = data.final_score;
        assesment.instructor_coordinator= data.instructor_coordinator;
        assesment.first_instructor = data.first_instructor;
        assesment.second_instructor = data.second_instructor;
   

        const getIdassesment = await this.assesmentRepository.save(assesment)
        

        const getId = await this.prgramService.findOneByIds(data.programs)
        assesment.programs = getId

        const getIdCourses = await this.coursesService.findOneByIds(data.courses)
        assesment.courses= getIdCourses

        const score: Score[]= []

        for (const scores of data.scores) {
            const result = await this.scoreService.create({...scores, assesmentId: getIdassesment.id})   //DTO ==> DTO
            score.push(result)
        }

        

        
        const result = await this.assesmentRepository.save({
            ...score,
            ...assesment
        })

        console.log('HASILILL ====>>',result);
        
        return result

        // return this.assesmentRepository.save(assesment)

    }

    async update(data : CreateAssesmentDto, id: number) {


        const assesment = await this.assesmentRepository.findOne({where: {id}})

        const getIdTRainee = await this.traineeService.findOneByIds(data.trainee)
        assesment.trainee = getIdTRainee;

        assesment.final_score = data.final_score
        assesment.instructor_coordinator= data.instructor_coordinator;
        assesment.first_instructor = data.first_instructor;
        assesment.second_instructor = data.second_instructor;
   


        const getIdassesment = await this.assesmentRepository.save(assesment)

        const getId = await this.prgramService.findOneByIds(data.programs)
        assesment.programs = getId

        
        const getIdCourses = await this.coursesService.findOneByIds(data.courses)
        assesment.courses= getIdCourses

        const tempScore = await this.scoreService.findRelationAsesment(getIdassesment.id)

        if (tempScore.length > 0) {
            const idDelete = tempScore.filter(x => !data.scores.some(x2 => x.id == x2.id));
            idDelete.forEach(x => this.scoreService.delete(x.id))

            for (const score of tempScore) {
                if (data.scores.length == 0) {
                    this.scoreService.delete(score.id)
                }
            }
        }

        const score: Score[]= []

        for (const scores of data.scores) {
            const result = await this.scoreService.update({...scores, assesmentId: getIdassesment.id})
            score.push(result)
        }

        

        
        const result = await this.assesmentRepository.save({
            ...score,
            ...assesment,
            id: Number (id)
        })

        console.log('HASILILL ====>>',result);
        
        return result
             
    }

    async delete(id: number) :Promise<DeleteResult> {
        return await this.assesmentRepository.delete(id)
    }

    
}