import BaseController from "@controllers/base.controller";
import { FilterCourse, Program } from "@models/program/program.entity";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProgramService } from "@services/program/program.service";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { async } from "crypto-random-string";
import { CreateCourseDto } from "src/dtos/program/program.dto";
import { promises } from "fs";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";

@Controller('programs')
@UseGuards(JwtAuthGuard)
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper)
export class CourseController extends BaseController<any> {
    constructor(private readonly programService : ProgramService) {super()}

    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Program>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.programService.paginate(options, params.term)
    }

    @Get('/all')
    async findAllProgram() {
        return {
            data : await this.programService.findAll()
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id : number) {
        
        if (typeof id === 'number') {
            return {
                data : await this.programService.findOne(id)
            }
        } throw new BadRequestException
    }


    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateCourseDto) {
            await this.programService.create(data)
        return plainToClass(FilterCourse, data)
    }

    @Put(':id')
    async update(@Body() data : CreateCourseDto, @Param('id') id : number) {
        return {
            data : await this.programService.update(data, id)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.programService.delete(id)
    }

    
} 

// @Get()
// async findAll() : Promise<Program[]> {
//     const data = await this.programService.findAll()
//     return {
//         data : plainToClass(FilterCourse,data)
//     }
// }


// @Get()
// async findAll() {
//     return {
//         data : await this.programService.findAll()
//     }
// }