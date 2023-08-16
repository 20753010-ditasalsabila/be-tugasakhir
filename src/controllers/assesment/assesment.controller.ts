import BaseController from "@controllers/base.controller";
import { Assesment, FilterAssesment } from "@models/assesment/assesment.entity";
import { FilterCourses } from "@models/course/course.entity";
import { FilterCourse, Program } from "@models/program/program.entity";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Header, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Response, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AssesmentService } from "@services/assesment/assesment.service";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { response } from "express";
import { Pagination, IPaginationOptions } from "nestjs-typeorm-paginate";
import { CreateAssesmentDto } from "src/dtos/assesment/assesment.dto";
import { CreateCoursesDto } from "src/dtos/courses/courses.dto";
import { CreateCourseDto } from "src/dtos/program/program.dto";

@Controller('assesment')
@UseGuards(JwtAuthGuard)
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper)
export class AssesmentController extends BaseController<any> {
    constructor (private readonly assesmentService: AssesmentService) {super()}

    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Assesment>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.assesmentService.paginate(options, params.term)
    }

    @Get('/report')
    async findAllReport(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Assesment>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.assesmentService.paginateReport(options, params.term)
    }

    
    // @Get('report/downloadpdf/:id')
    // @Header('Content-Type', 'application/pdf')
    // @Header('Content-Disposition', 'inline; filename=test.pdf')
    // async genpdf(@Res() res: Response,) {
    //     return this.assesmentService.genpdf(res)
    // }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe)id : number) {
        if (typeof id === 'number') {
            return {
                data : await this.assesmentService.findOne(id)
            }
        } throw new BadRequestException
    }

    @Get('report/download/pdf/:id')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'inline; filename=test.pdf')
    async downloadPdf(
        @Param('id', ParseIntPipe)id : number,
        @Response() res: Response,
        ) {
        if (typeof id === 'number') {
            return {
                data : await this.assesmentService.genpdf(res,id)
            }
        } throw new BadRequestException
    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateAssesmentDto) {
        try {
            await this.assesmentService.create(data)
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') { 
                throw new HttpException('Duplicate Entity', HttpStatus.UNPROCESSABLE_ENTITY); //==> respon data duplikat
            }
        }
        return plainToClass(FilterCourses, data)
    }

    @Put(':id')
    async update(@Body() data: CreateAssesmentDto, @Param('id') id : number) {
        return {
            data : await this.assesmentService.update(data, id)
        }
    }
    
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.assesmentService.delete(id)
    }
}


// @Get()
// async findAll() {
//     const data = await this.assesmentService.findAll()
//     return {
//         data : plainToClass(FilterAssesment,data)
//     }
// }