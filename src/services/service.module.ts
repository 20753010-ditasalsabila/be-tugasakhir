import { HttpModule, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import UtilityModule from '../utils/utility.module';
import models from '../models';
import services from './index';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Repository } from 'typeorm';
// import { AuthModule } from './login/auth/auth.module';






@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([...models]), UtilityModule],
  providers: [...services,],
  exports: [...services],
})

export default class ServiceModule {
  
}
