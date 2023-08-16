import BaseController from "@controllers/base.controller";
import { EntityNotFoundExceptionFilter } from "@models/staff/exeption.filter";
import { FilerStaff, Staff } from "@models/staff/staff.entity";
import { Body, ClassSerializerInterceptor, HttpCode, HttpStatus, Param, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Delete, Get, Post, Put } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { BadRequestException, ForbiddenException, HttpException } from "@nestjs/common/exceptions";
import { DefaultValuePipe, ParseIntPipe } from "@nestjs/common/pipes";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import { StaffService } from "@services/staff/staff.service";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { plainToClass } from "class-transformer";
import { Pagination, IPaginationOptions } from "nestjs-typeorm-paginate";
import { CreateStaffDto } from "src/dtos/staff/staff.dto";


@Controller('users')
@UseGuards(JwtAuthGuard) // authorization menggunakan token
@UseFilters(new EntityNotFoundExceptionFilter) //respon untuk 404 not found dalam pencarian data
@UseInterceptors(ResponseMapper) 
export class StaffController extends BaseController<any> {
    constructor(private readonly staffService : StaffService) {super()}
    
    @Get()
    async findAll(
        @Query('q') term?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number = 1,
        ): Promise<Pagination<Staff>> {

        const options : IPaginationOptions = {limit, page};
        const params: { term?: string } = { term };

        return await this.staffService.paginate(options, params.term)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {

        if (typeof id === 'number') { // untuk validasi harus menggunakan number
             return {
                data : await this.staffService.findOne(id)
            }
        } throw new BadRequestException

    }


    @Post() 
    @UsePipes(ValidationPipe) //untuk validasi harus passord 8 karakter dan email harus menggunakan @
    async create(@Body() data : CreateStaffDto) {
            await this.staffService.create(data)
        return plainToClass(FilerStaff, data)

    }

    @Put(':id')
    async update(@Body() data : CreateStaffDto, @Param('id') id : number) {
        return {
            data : await this.staffService.update(data, id)
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number ) {
        return await this.staffService.delete(id)
    }

}


// async findAll() {
//     const data = await this.staffService.findAll()
//     return {
//          data : plainToClass(FilerStaff,data)
//     } 
// }

// return {
//     data : await this.staffService.findAll()
// } 

// return {
        //     data : await this.staffService.findAll()
        // } 


        // try {
        //     return await this.userProfilesRepository.save(userProfile);
        // } catch (err) {
        //    if (err.code === 'ER_DUP_ENTRY') {
        //        //handleHttpErrors(SYSTEM_ERRORS.USER_ALREADY_EXISTS);
        //    } else {
        //        //handleHttpErrors(err.message);
        //     }
        // }


        //     try {
        //     await this.staffService.create(data)
        // } catch (error) {
        //     if (error.code === 'ER_DUP_ENTRY') { 
        //         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        //     }
        // } 


                // return {
        //     data : await this.staffService.create(data)
        // }