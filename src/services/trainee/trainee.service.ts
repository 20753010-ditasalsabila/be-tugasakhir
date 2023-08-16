import { Trainee } from "@models/trainee/trainee.entity";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { CreateTraineeDto } from "src/dtos/trainee/trainee.dto";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import * as PdfPrinter from 'pdfmake';
import { Assesment } from "@models/assesment/assesment.entity";



@Injectable()
export class TraineeService {
    constructor(@InjectRepository(Trainee) private traineeRepository:Repository<Trainee>) {}

    async paginate(options : IPaginationOptions, q = '') : Promise<Pagination<Trainee>> {
        const qb = this.traineeRepository.createQueryBuilder('q');
        const term = `%${q.trim()}%`;

        if (term) {
            qb.where('q.fullname LIKE :term', { term });
        }
        qb.orderBy('q.id', 'DESC');
    
    
        return paginate<Trainee>(qb, options)
    }
    
    findAll() {
        return this.traineeRepository.find()
    }
    
    findOne(id : number){
        return this.traineeRepository.findOneOrFail({where: {id}})
    }

    async genpdf(response, id : number) {
        const data = await this.findOneReport(id);
        const content: any[] = [
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
                        ['Name', ':', `${data.fullname}`],
                        ['College', ':', `${data.instance}`],
                        ['Major', ':', `${data.major}`],
                        ['Email', ':', {text: `${data.email}`,color: '#23418f'}],
                    ],
                    margin: [ 5, 2]
                },
                layout: 'noBorders', margin: [ 5, 2, 10, 20 ]
            }
        ];
        for (const assesment of data.assesment) {
            const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const programStartDate = new Date(assesment.programs.start_date);
            const programEndDate = new Date(assesment.programs.end_date);
            const startDate = programStartDate.toLocaleDateString("en-US", { day: 'numeric' })+" "+ programStartDate.toLocaleDateString("en-US", { month: 'short' })+" "+programStartDate.toLocaleDateString("en-US", { year: 'numeric' });
            const endDate = programEndDate.toLocaleDateString("en-US", { day: 'numeric' })+" "+ programEndDate.toLocaleDateString("en-US", { month: 'short' })+" "+programEndDate.toLocaleDateString("en-US", { year: 'numeric' });


            content.push(
                { text: 'Programs', style: 'bigger', margin: [ 0,5] },
                {
                    table: {
                        headerRows: 1,
                        body: [
                            ['Program Name', ':', `${assesment.programs.name}`],
                            ['Course Name', ':', `${assesment.courses.course_name}`],
                            ['Date', ':', `${startDate} - ${endDate}`],
                            ['Batch', ':', `${assesment.programs.batch}`],
                            ['Type', ':', `${assesment.programs.type}`],
                            ['Instructor Coordinator ', ':', `${assesment.programs.instructor_coordinator}`],
                            ['Instructor ', ':', `${assesment.programs.first_instructor}`],
                            ['Instructor ', ':', `${assesment.programs.second_instructor}`],
                        ], margin: [ 5, 2]
                    },
                    layout: 'noBorders'
                },
                { text: 'Course Assessment :', style: 'biggers', margin: [ 0,5] },
                {
                    table: {
                        headerRows: 3,
                        widths: ['*','*','*'],
                        body: [
                                [
                                    {text: 'Items ', style: 'tableHeader', fillColor: '#23418f'}, 
                                    {text: 'Weight ', style: 'tableHeader', fillColor: '#23418f'}, 
                                    {text: 'Score ', style: 'tableHeader', fillColor: '#23418f'}
                                ],
                                [
                                    '',
                                    '',
                                    '',
                                ],
                        ]
                        .concat(assesment.scores.map((items, i) => 
                        [
                            items.criteria_name, 
                            items['weight']+'%', 
                            items['scores'].toString()
                        ])),
                        // margin: [5, 3]
                    }, alignment: 'center'
                },
                '\n\n',
                {
                    style: 'tableExample',
                    table: {
                            widths: ['*', '*', '*'],
                            body: [
                                    [
                                        {colSpan: 2, rowSpan: 1, text: 'Final Score :' , style: 'biggers', alignment: 'right', border: [false, false, false, false],},
                                        '', 
                                        {text:`${assesment.final_score}`, style: 'biggers', alignment: 'center',fillColor: '#eeffee',border: [false, false, false, true]}
                                    ],
                                ]
                            },margin: [ 0, 5],alignment: 'center'
                        },
                        '\n\n'
            )
        }
        
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
                title: `${data.fullname}_Report.pdf`,
                author: 'Enigma Camp',
                subject: 'Enigma Camp assesment',
                keywords: 'Assesment',
            },
            content: content,
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



    async findOneReport(id : number){

        const qb : SelectQueryBuilder<Trainee> = this.traineeRepository.createQueryBuilder('p');
        qb.leftJoinAndSelect('p.assesment','assesment')
        qb.leftJoinAndSelect('assesment.programs','program')
        qb.leftJoinAndSelect('assesment.courses','course')
        qb.leftJoinAndSelect('assesment.scores','score')
        .where('p.id = :id',{id})
        // .getOne()
        
        console.log("data====>", await qb.getOne());

        return await qb.getOne();
        

        // return this.traineeRepository.findOneOrFail({where: {id}})
    }

    async findOneByIds(id : number) {
        return await this.traineeRepository.findOneOrFail({where: {id}})
    }

    async findByFullname(fullname : string) {
        return await this.traineeRepository.findOne({where: {fullname}})
    }

    async findByEmail(email : string) {
        return await this.traineeRepository.findOne({where: {email}})
    }
    async findByPhone(phone : string) {
        return await this.traineeRepository.findOne({where: {phone}})
    }

   async validate(fullname, email, phone, id? : number) {
        const data = await this.findByFullname(fullname)
        const data2 = await this.findByEmail(email)
        const data3 = await this.findByPhone(phone) 

        if (data && data.id != id) {
            throw new UnprocessableEntityException(`This Fullname already exists`)
        }
        if (data2 && data2.id != id ) {
            throw new UnprocessableEntityException(`This E-mail already exists`)
        }
        if (data3 && data3.id != id ) {
            throw new UnprocessableEntityException(`This Phone Number already exists`)
        }
    }


    async create(data : CreateTraineeDto) {

        await this.validate(data.fullname,data.email, data.phone) 

        const trainee =  new Trainee();

        trainee.fullname = data.fullname;
        trainee.email = data .email;
        trainee.gender = data.gender;
        trainee.phone = data.phone;
        trainee.city = data.city;
        trainee.instance = data.instance;
        trainee.major = data.major;

        return this.traineeRepository.save(trainee)


    }

    async update(data : CreateTraineeDto, id : number) {
        await this.validate(data.fullname,data.email, id) 

        return this.traineeRepository.save({...data, id: Number (id)})
    }

    async delete(id: number) :Promise<DeleteResult> {
        return await this.traineeRepository.delete(id)
    }


    
}


// async paginate(options : IPaginationOptions) : Promise<Pagination<Trainee>> {
//     const qb = this.traineeRepository.createQueryBuilder('q');
//     qb.orderBy('q.id', 'DESC');


//     return paginate<Trainee>(qb, options)
// }


