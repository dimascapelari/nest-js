import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// app.module.ts : Módulo principal do aplicativo
// app.controller.ts : Define as rotas e lida com as requisições
// app.service.ts : Contém a lógica de negócio, separado do controlador

// Arquivo que inicia nosso projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Libera para todos fazerem requisição
  });

  // Libera somente para o site especifico
  // app.enableCors({
  //   origin: ['https://meusite.com'],
  // });

  // ValidationPipe = para fazer validações e é preciso instalar -> npm i class-validator class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // se true ele remove as chaves que não tem no DTO
    }),
  );

  // Configuração do Swagger --------------------
  const configSwagger = new DocumentBuilder()
    .setTitle('Lista de tarefas')
    .setDescription('API lista de tarefas')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('dimasAPI', app, documentFactory);
  // -----------------------------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
