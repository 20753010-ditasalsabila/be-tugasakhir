import BaseController from "@controllers/base.controller";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { FilterTrainer, Trainer } from "@models/trainer/trainer.entity";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import { TrainerService } from "@services/trainer/trainer.service";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { CreateTrainerDto } from "src/dtos/trainer/trainer.dto";

@Controller('trainers')
@UseGuards(JwtAuthGuard)
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper) 
export class TrainerController extends BaseController<any> {
    constructor(private readonly trainerService : TrainerService) {super()}
    
    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,)
        : Promise<Pagination<Trainer>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

            
        return await this.trainerService.paginate(options,params.term)
    }

    @Get('/all')
    async findAllTrainer() {
        const data = await this.trainerService.findAll()
        return {
            data : plainToClass(FilterTrainer,data,)
        } 
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe)id : number) {
        if (typeof id === 'number') {
            return {
                data : await this.trainerService.findOne(id)
            }
        } throw new BadRequestException
    }


    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateTrainerDto) {
            await this.trainerService.create(data)

        return plainToClass(FilterTrainer, data)
    }

    @Put(':id')
    async update(@Body() data: CreateTrainerDto, @Param('id') id : number) {
        return {
            data : await this.trainerService.update(data, id)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.trainerService.delete(id)
    }
}


// @Get()
// async findAll() {
//     const data = await this.trainerService.findAll()
//     return {
//         data : plainToClass(FilterTrainer,data)
//     }
// }