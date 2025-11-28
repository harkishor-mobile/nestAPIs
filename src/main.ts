// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function startApp() {
  const app = await NestFactory.create(AppModule);

  //  Global ValidationPipe (MUST be before filters)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global response wrapper
  app.useGlobalInterceptors(new ResponseInterceptor());

  //  Global Error Handler Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}

startApp();
