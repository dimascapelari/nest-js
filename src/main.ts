import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// app.module.ts : Módulo principal do aplicativo
// app.controller.ts : Define as rotas e lida com as requisições
// app.service.ts : Contém a lógica de negócio, separado do controlador

// Arquivo que inicia nosso projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
