// import BaseController from "@controllers/base.controller";
// import { FilterTrainer } from "@models/trainer/trainer.entity";
// import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
// // import { WeightService } from "@services/weight/weight.service";
// import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
// import { plainToClass } from "class-transformer";
// import { CreateCriteriaDto } from "src/dtos/criteria/criteria.dto";
// import { CreateWeightDto } from "src/dtos/weight/weight.dto";

// @Controller('weight')
// @UseInterceptors(ResponseMapper) 
// export class WeightController extends BaseController<any> {
//     // constructor(private readonly weightService : WeightService) {super()}

//     @Get()
//     async findAll() {
//         return {
//             data : await this.weightService.findAll()
//         }
//     }

//     @Get(':id')
//     async findOne(@Param('id', ParseIntPipe)id : number) {
//         if (typeof id === 'number') {
//             return {
//                 data : await this.weightService.findOne(id)
//             }
//         } throw new BadRequestException
//     }


//     @Post()
//     @UsePipes(ValidationPipe)
//     async create(@Body() data : CreateWeightDto) {

//         try {
//             await this.weightService.create(data)
//         } catch (error) {
//             if (error.code === 'ER_DUP_ENTRY') { 
//                 throw new HttpException('Duplicate Entity', HttpStatus.UNPROCESSABLE_ENTITY); //==> repon data duplikat
//             }
//         }
//         return plainToClass(FilterTrainer, data)
//     }

//     @Put(':id')
//     async update(@Body() data: CreateWeightDto, @Param('id') id : number) {
//         return {
//             data : await this.weightService.update(data, id)
//         }
//     }

//     @Delete(':id')
//     async remove(@Param('id', ParseIntPipe) id : number) {
//         return await this.weightService.delete(id)
//     }
// }