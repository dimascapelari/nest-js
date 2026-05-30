import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthAminGuard } from '../common/guards/admin.guard';

@Module({
  imports: [UsersModule, TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthAminGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
