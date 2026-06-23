import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../src/users/users.module';
import { TasksModule } from '../src/tasks/tasks.module';
import { AuthModule } from '../src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PrismaService } from '../src/prisma/prisma.service';
import * as dotenv from 'dotenv';
import { execSync } from 'node:child_process';

dotenv.config({ path: '.env.test' });

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeAll(() => {
    execSync('npx prisma migrate deploy');
  });

  beforeEach(async () => {
    execSync(
      'cross-env DATABASE_URL=file:./dev-test.db npx prisma migrate deploy',
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        UsersModule,
        TasksModule,
        AuthModule,
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', '..', 'files'),
          serveRoot: '/files',
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    prismaService = module.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany(); // apaga todos os usuário do banco
  });

  afterEach(async () => {
    await app.close(); // garante que o app será encerrado depois dos testes
  });

  describe('/users', () => {
    it('/users (POST) - createUser', async () => {
      const createUserDto = {
        name: 'Dimas Test',
        email: 'dimas-teste@teste.com',
        password: '123123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // console.log(response.status);

      expect(response.body).toEqual({
        id: response.body.id,
        name: 'Dimas Test',
        email: 'dimas-teste@teste.com',
      });
    });

    it('/users (POST) - weak password', async () => {
      const createUserDto = {
        name: 'Dimas Test',
        email: 'teste@teste.com',
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);

      expect(response.body.message.message[0]).toEqual(
        'password must be longer than or equal to 6 characters',
      );

      // console.log('RESPOSTA ', response.body);
    });

    it('/users (PATCH) - update user', async () => {
      const createUserDto = {
        name: 'Mariana Test',
        email: 'mariana.teste@teste.com',
        password: '123123',
      };

      const updateUserDto = {
        name: 'Mariana Capelari',
      };

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const auth = await request(app.getHttpServer()).post('/auth').send({
        email: createUserDto.email,
        password: createUserDto.password,
      });

      // console.log(auth.body);

      expect(auth.body.token).not.toBeNull();
      expect(auth.body.token).toEqual(auth.body.token);

      const response = await request(app.getHttpServer())
        .patch(`/users/${auth.body.id}`)
        .set('Authorization', `Bearer ${auth.body.token}`)
        .send(updateUserDto);
      // .expect(401);

      // console.log(response.body);
      // expect(user.body.name).toEqual(updateUserDto.name);

      expect(response.body).toEqual({
        id: auth.body.id,
        name: updateUserDto.name,
        email: createUserDto.email,
      });
    });

    it('/users (DELETE) - delete a user', async () => {
      // Cadastrar um usuário
      // Logar o usuário
      // Pegar o token dele
      // Deletar o usuário passando o token dele

      // Cadastrar um usuário
      const createUserDto = {
        name: 'Dimas Test',
        email: 'dimas.teste@teste.com',
        password: '123123',
      };

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Logar o usuário
      const auth = await request(app.getHttpServer()).post('/auth').send({
        email: createUserDto.email,
        password: createUserDto.password,
      });

      // const userId = auth.body.id;
      const userId = user.body.id;
      const userToken = auth.body.token;

      // Deletar o usuário passando o token dele
      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearear ${userToken}`);

      // console.log(response.body);

      expect(response.body.message).toEqual(
        'Usuário foi deletado com sucesso!',
      );
    });
  });
});
