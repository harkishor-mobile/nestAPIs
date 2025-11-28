// src/common/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './winston-logger';

@Module({
  imports: [WinstonModule.forRoot(winstonOptions)],
  exports: [WinstonModule],
})
export class LoggerModule {}
