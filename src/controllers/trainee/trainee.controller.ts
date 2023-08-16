import BaseController from "@controllers/base.controller";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { FilterTrainee, Trainee } from "@models/trainee/trainee.entity";
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Header, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe, Response } from "@nestjs/common";
import PagedSearchService from "@services/common/paged-search.service";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import { TraineeService } from "@services/trainee/trainee.service";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { CreateTraineeDto } from "src/dtos/trainee/trainee.dto";

@Controller('trainees')
@UseGuards(JwtAuthGuard) //== > menggunakan token
@UseFilters(new EntityNotFoundExceptionFilter)
@UseInterceptors(ResponseMapper) 
export class TraineeController extends BaseController<any> {
    constructor(private readonly traineeService : TraineeService) {super()} 

    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Trainee>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.traineeService.paginate(options, params.term)
    }

    @Get('/all')
    async findAllTrainee() {
        const data = await this.traineeService.findAll()
        return {
            data : plainToClass(FilterTrainee,data,)
        }
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id : number) {
        
        if (typeof id === 'number') {
            return {
                data : await this.traineeService.findOne(id)
            }
        } throw new BadRequestException
    }

    @Get('report/:id')
    async findOneReport(@Param('id', ParseIntPipe) id : number) {
        
        if (typeof id === 'number') {
            return {
                data : await this.traineeService.findOneReport(id)
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
                data : await this.traineeService.genpdf(res,id)
            }
        } throw new BadRequestException
    }




    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data : CreateTraineeDto) {
            await this.traineeService.create(data)
        return plainToClass(FilterTrainee, data)
        
    }

    @Put(':id')
    async update(@Body() data : CreateTraineeDto, @Param('id') id: number) {
        return {
            data : await this.traineeService.update(data, id)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number) {
        return await this.traineeService.delete(id)
    }



}

// @Get()
// async findAll(
//     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
//     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
// ): Promise<Pagination<Trainee>> {

//     const options : IPaginationOptions = {limit, page};
    
    
//     return await this.traineeService.paginate(options)
// }


// @Get()
//     async findAll() {
//         const data = await this.traineeService.findAll()
//         return {
//             data : plainToClass(FilterTrainee,data,)
//         }
//     }