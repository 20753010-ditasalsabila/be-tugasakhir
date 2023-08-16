import BaseController from "@controllers/base.controller";
import { Courses } from "@models/course/course.entity";
import { Trainee } from "@models/trainee/trainee.entity";
import { Trainer } from "@models/trainer/trainer.entity";
import { Controller, Get, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtAuthGuard } from "@services/login/auth/jwt-auth.guard";
import ResponseMapper from "@util/interceptor/response-mapper.interceptor";
import { Repository } from "typeorm";

@Controller('dashboard')
// @UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseMapper) 
export class DashboardController extends BaseController<any> {
    constructor(
        @InjectRepository(Trainer) private trainerRepository : Repository<Trainer>,
        @InjectRepository(Trainee) private traineeRepository : Repository<Trainee>,
        @InjectRepository(Courses) private coursesRepository : Repository<Courses>

        ){
        super();
    }
    
    @Get()
    async count() {
        return {
            data : [{
                Total_Trainer: await this.trainerRepository.count(),
                Total_Trainee: await this.traineeRepository.count(),
                Total_Course: await this.coursesRepository.count()
            }]
        }
    }
}