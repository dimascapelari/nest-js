import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teste')
  getTest() {
    return 'Rota de Teste da API';
  }

  @Post('/teste')
  createTest() {
    return 'ROTA POST FUNCIONANDO';
  }

  @Get('/dimas')
  getDimas() {
    return this.appService.getDimas();
  }
}
