import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

// app.module.ts : Módulo principal do aplicativo
// app.controller.ts : Define as rotas e lida com as requisições
// app.service.ts : Contém a lógica de negócio, separado do controlador

// Arquivo que inicia nosso projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe = para fazer validações e é preciso instalar -> npm i class-validator class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // se true ele remove as chaves que não tem no DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
