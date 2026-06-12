// Testes unitários
// Testes ponta a ponta (e2e)

import { Test, TestingModule } from '@nestjs/testing';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

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
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });
  it('should be define users service', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user', async () => {
    // Preciso criar um createUserDto
    // Preciso que o hashingService tenha o método hash
    // Verificar se o hashingService foi chamado com o parametro createUserDto.password
    // Verificar se prisma user create foi chamado
    // O retorno deve ser o novo user criado

    //  > Configuração do teste (Arrange)
    const createUserDto: CreateUserDto = {
      name: 'Testeteste',
      email: 'testeteste@teste.com',
      password: '123123',
    };

    jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO');

    // > Algo que deseja fazer a ação (Act)
    await userService.create(createUserDto);

    // > Conferir se a ação foi esperada (Assert)
    expect(hashingService.hash).toHaveBeenCalled();
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'HASH_MOCK_EXEMPLO',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  });
});
