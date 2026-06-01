import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from '../common/filters/exception-filter';
import { DimasConsole, TaskUtils } from './tasks.utils';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskUtils,
    DimasConsole,

    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class TasksModule {}
