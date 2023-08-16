import BaseController from "@controllers/base.controller";
import { Courses, FilterCourses } from "@models/course/course.entity";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CoursesService } from "@services/courses/courses.service";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { Pagination, IPaginationOptions } from "nestjs-typeorm-paginate";
import { CreateCoursesDto } from "src/dtos/courses/courses.dto";

@Controller('course')
@UseGuards(JwtAuthGuard)
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper) 
export class CoursesController extends BaseController<any> {
    constructor(private readonly coursesService : CoursesService ) {super()}

    
    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Courses>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.coursesService.paginate(options, params.term)
    }

    @Get('/all')
    async findAllCourse() {
        return {
            data : await this.coursesService.findAll()
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe)id : number) {
        if (typeof id === 'number') {
            return {
                data : await this.coursesService.findOne(id)
            }
        } throw new BadRequestException
    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateCoursesDto) {
            await this.coursesService.create(data)
        return plainToClass(FilterCourses, data)
    }

    @Put(':id')
    async update(@Body() data: CreateCoursesDto, @Param('id') id : number) {
        return {
            data : await this.coursesService.update(data, id)
        }
    }
    
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.coursesService.delete(id)
    }
    
}

// @Get()
// async findAll(
//     @Query('q') term?: string,
//     @Query('order') order?: string,
//     @Query('sort') sort? : 'ASC' | 'DESC',
//     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
//     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
//     ): Promise<Pagination<Courses>> {

//     const options : IPaginationOptions = {limit, page};
//     const params: { term?: string, order?: string, sort?: 'ASC' | 'DESC' } = { term, order, sort };

//     return await this.coursesService.paginate(options, params)
// }