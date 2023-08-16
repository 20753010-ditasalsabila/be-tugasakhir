import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { configure, serverOptions } from './config';
import * as session from 'express-session';
import * as express from "express";

async function bootstrap() {
  
  const app: NestApplication = await NestFactory.create(AppModule, { ...serverOptions() });
  configure(app);
  app.useGlobalPipes(new ValidationPipe(
    {
      transformOptions: {
        enableImplicitConversion: true
      }
    }
  ));
  app.use(
    session({
      secret : 'SEFESESEFSEGSGSE',
      resave : false,
      saveUninitialized : true,
      cookie:{
        maxAge : 60000,
      },
    }),
  );

  await app.listen(process.env.APP_PORT, process.env.APP_HOST);


}

bootstrap()
  .then(() => {
    Logger.log(
      `${process.env.APP_NAME} service available on ${process.env.APP_BASE_URL}`,
      'bootstrap',
      true,
    );
  })
  .catch((error: Error) => {
    Logger.error(
      `${process.env.APP_NAME} service failed to start, ${error.message}`,
      error.stack,
      'bootstrap',
      true,
    );

    process.exit(1);
  });



