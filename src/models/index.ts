import { Assesment } from "./assesment/assesment.entity";
import { Courses } from "./course/course.entity";
import { WeightCriteria } from "./criteria/criteria-weight.entity";
import { Criteria } from "./criteria/criteria.entity";
import { Detail } from "./criteria/detail.criteria.entity";
import { Program } from "./program/program.entity";
import { Score } from "./score/score.entity";
import { Staff } from "./staff/staff.entity";
import { Trainee } from "./trainee/trainee.entity";
import { Trainer } from "./trainer/trainer.entity";



const models = [Staff,WeightCriteria, Trainee, Trainer, Program, Courses, Criteria, Assesment, Detail, Score];

export default models;
