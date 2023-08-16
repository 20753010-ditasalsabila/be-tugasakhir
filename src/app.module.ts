import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { databaseConfiguration, passportConfiguration, redisConfiguration } from './config';
import ControllerModule from './controllers/controller.module';
import UtilityModule from './utils/utility.module';
import ServiceModule from './services/service.module';
import { APP_FILTER } from '@nestjs/core';
import HttpExceptionFilter from '@util/http-exception.filter';
import { Trainee } from '@models/trainee/trainee.entity';
import { Staff } from '@models/staff/staff.entity';
import { StaffController } from '@controllers/staff/staff.controlller';
import { TraineeController } from '@controllers/trainee/trainee.controller';
import { Trainer } from '@models/trainer/trainer.entity';
import { LoginController } from '@controllers/login.controller';
import { Program } from '@models/program/program.entity';

import { TrainerController } from '@controllers/trainer/trainer.controller';
import { CourseController } from '@controllers/program/program.controller';
import { Courses } from '@models/course/course.entity';
import { DashboardController } from '@controllers/dashboard/dashboard';
import { Criteria } from '@models/criteria/criteria.entity';
import { CriteriaController } from '@controllers/criteria/criteria.controller';
import { Assesment } from '@models/assesment/assesment.entity';
// import { Weight } from '@models/weight/weight.entity';
// import { WeightController } from '@controllers/weight/weight.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@services/login/auth/constans';
import { LocalStrategy } from '@services/login/auth/local.strategy';
import { JwtStrategy } from '@services/login/auth/jwt.strategi';
import { WeightCriteria } from '@models/criteria/criteria-weight.entity';
import { Score } from '@models/score/score.entity';
// import { DetailCriteria } from '@models/criteria/detail.criteria.entity';








@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseConfiguration()}),
    RedisModule.forRoot({ ...redisConfiguration() }),
    PassportModule.register({ ...passportConfiguration() }),
    UtilityModule,
    ServiceModule,
    ControllerModule,
    TypeOrmModule.forFeature([Staff, Trainee, Trainer, Program, Courses, Criteria, Assesment,WeightCriteria, Score]),
    JwtModule.register({
      secret : jwtConstants.secret,
      signOptions : { expiresIn: '60s'}
    })
],
  exports: [TypeOrmModule],
  controllers: [StaffController, TraineeController, CourseController, TrainerController, DashboardController, CriteriaController, ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    LocalStrategy, JwtStrategy
  ], 
  
})
export default class AppModule {}
