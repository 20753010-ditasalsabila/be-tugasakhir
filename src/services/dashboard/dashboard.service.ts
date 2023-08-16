import { Trainee } from "@models/trainee/trainee.entity";
import { Trainer } from "@models/trainer/trainer.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
    constructor(@InjectRepository(Trainer) private trainerRepository : Repository<Trainer>) {}
    
    countItem() {
        return this.trainerRepository.count()
    }

}