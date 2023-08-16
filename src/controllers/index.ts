



import { AssesmentController } from './assesment/assesment.controller';
import { CoursesController } from './course/courses.controller';
import { CriteriaController } from './criteria/criteria.controller';
import { DetailCriteriaController } from './criteria/detail-criteria.controller';
import { DashboardController } from './dashboard/dashboard';
import { LoginController } from './login.controller';
import { CourseController } from './program/program.controller';
import { StaffController } from './staff/staff.controlller';
import { TraineeController } from './trainee/trainee.controller';
import { TrainerController } from './trainer/trainer.controller';
// import { WeightController } from './weight/weight.controller';







const controllers = [
   LoginController, StaffController, TraineeController, TrainerController, CourseController, CoursesController, CriteriaController, AssesmentController, DetailCriteriaController
];

export default controllers;
