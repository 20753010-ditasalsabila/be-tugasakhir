import GuardService from './security/guard.service';

import RedisStoreService from './utility/redis-store.service';
import CookieGuard from './security/cookie.guard';
import CookieStrategy from './security/cookie.strategy';
import EndpointService from './endpoint.service';
import PagedSearchService from './common/paged-search.service';
import TranslationService from './common/translation.service';
import HttpClientService from './common/http-client.service';

import { JwtService } from '@nestjs/jwt';


import { PassportModule } from '@nestjs/passport';
import { AuthService } from './login/auth/auth.service';
import { UsersService } from './login/users/users.service';
import { StaffService } from './staff/staff.service';
import { StaffController } from '@controllers/staff/staff.controlller';
import { TraineeService } from './trainee/trainee.service';
import { TrainerService } from './trainer/trainer.service';
import { ProgramService } from './program/program.service';
import { CoursesService } from './courses/courses.service';
import { DashboardService } from './dashboard/dashboard.service';
import { CriteriaService } from './criteria/criteria.service';
import { AssesmentService } from './assesment/assesment.service';
import { DetailCriteriaService } from './criteria/detail-Criteria.service';
import { WeightCriteriaService } from './weight/weightcriteria.service';
import { ScoreService } from './score/score.service';
// import { DetailCriteriaService } from './criteria/detail-Criteria.service';
// import { WeightService } from './weight/weight.service';
// import { StaffModule } from './staff/staff.module';







// const certificateService = [];
const masterService = [];
const securityService = [GuardService, CookieGuard, CookieStrategy];
const commonService = [
  
  RedisStoreService,
  EndpointService,
  PagedSearchService,
  TranslationService,
  HttpClientService,
  JwtService,
  PassportModule,
  UsersService,
  AuthService,
  StaffService,
  TraineeService,
  TrainerService,
  ProgramService,
  CoursesService,
  DashboardService,
  CriteriaService,
  // WeightService,
  AssesmentService,
  DetailCriteriaService,
  WeightCriteriaService,
  ScoreService



 



  
  
];

const services = [...commonService, ...securityService, ...masterService];

export default services;
