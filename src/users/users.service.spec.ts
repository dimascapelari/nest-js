// Testes unitários
// Testes ponta a ponta (e2e)

import { Test, TestingModule } from '@nestjs/testing';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

/*
    => Padrão AAA

     > Configuração do teste (Arrange)
     > Algo que deseja fazer a ação (Act)
     > Conferir se a ação foi esperada (Assert)
*/

// describe('UsersService', () => {
//   //   it('deveria testar o modulo usersservice', () => {});
//   //   test('testar se o users service foi definido', () => {});

//   it('should be define users service', () => {
//     const numero1 = 150;
//     const numero2 = 100;

//     const conta = numero1 - numero2;

//     // expect(conta).toBe(50);
//     expect(conta).toBeGreaterThan(10);
//   });
// });

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;
  let hashingService: HashingServiceProtocol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: HashingServiceProtocol,
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });
  it('should be define users service', () => {
    console.log(userService);
    expect(userService).toBeDefined();
  });
});
