import BaseController from "@controllers/base.controller";
import { Criteria } from "@models/criteria/criteria.entity";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { FilterTrainer } from "@models/trainer/trainer.entity";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CriteriaService } from "@services/criteria/criteria.service";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { Pagination, IPaginationOptions } from "nestjs-typeorm-paginate";
import { CreateCriteriaDto } from "src/dtos/criteria/criteria.dto";
import { CreateTrainerDto } from "src/dtos/trainer/trainer.dto";

@Controller('criterias')
@UseGuards(JwtAuthGuard)
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper) 
export class CriteriaController extends BaseController<any> {
    constructor(private readonly criteriaService : CriteriaService) {super()}

    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Criteria>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.criteriaService.paginate(options, params.term)
    }

    @Get('/all')
    async findAllCourse() {
        return {
            data : await this.criteriaService.findAll()
        }
    }
    

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe)id : number) {
        if (typeof id === 'number') {
            return {
                data : await this.criteriaService.findOne(id)
            }
        } throw new BadRequestException
    }


    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateCriteriaDto) {
            await this.criteriaService.create(data)
        return plainToClass(FilterTrainer, data)
    }

    @Put(':id')
    async update(@Body() data: CreateCriteriaDto, @Param('id') id : number) {
        return {
            data : await this.criteriaService.update(data, id)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.criteriaService.delete(id)
    }

}