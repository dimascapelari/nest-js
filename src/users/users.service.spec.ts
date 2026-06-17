// Testes unitários
// Testes ponta a ponta (e2e)

import { Test, TestingModule } from '@nestjs/testing';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

jest.mock('node:fs/promises');

// ----------   => Padrão AAA   ---------------------

//     > Configuração do teste (Arrange)
//     > Algo que deseja fazer a ação (Act)
//     > Conferir se a ação foi esperada (Assert)

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
              create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Testeteste',
                email: 'testeteste@teste.com',
              }),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be define users service', () => {
    expect(userService).toBeDefined();
  });

  describe('Create User', () => {
    it('should create a new user', async () => {
      // Preciso criar um createUserDto
      // Preciso que o hashingService tenha o método hash
      // Verificar se o hashingService foi chamado com o parametro createUserDto.password
      // Verificar se prisma user create foi chamado
      // O retorno deve ser o novo user criado

      // -> (Arrange)
      const createUserDto: CreateUserDto = {
        name: 'Testeteste',
        email: 'testeteste@teste.com',
        password: '123123',
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO');

      // -> (Act)
      const result = await userService.create(createUserDto);

      // -> (Assert)
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

      expect(result).toEqual({
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
      });
    });

    it('should throw error if prisma create fails', async () => {
      // -> (Arrange)
      const createUserDto: CreateUserDto = {
        name: 'Testeteste',
        email: 'testeteste@teste.com',
        password: '123123',
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO');
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new Error('Database error'));

      // -> (Act / Assert)
      await expect(userService.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'Falha ao cadastrar usuário!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

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

  describe('FindAll Users', () => {
    it('should return All Users', async () => {
      // -> (Arrange)
      const mockUsers = [
        {
          id: 1,
          name: 'Dimas',
          email: 'dimas@teste.com',
          avatar: null,
          passwordHash: 'hash_exemplo',
          active: true,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      // -> (Act)
      const result = await userService.findAll();

      // -> (Assert)
      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('FindOnde User', () => {
    it('should return a findOne user', async () => {
      // -> (Arrange)
      const mockUser = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
        Task: [],
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      // -> (Act)
      const result = await userService.findOne(1);

      // -> (Assert)
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          Task: true,
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw error exception when user is not found', async () => {
      // -> (Arrange)
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      // -> (Act / Assert)
      await expect(userService.findOne(1)).rejects.toThrow(
        new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST),
      );

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },

        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          Task: true,
        },
      });
    });
  });

  describe('Update User', () => {
    it('should throw exception when user is not found', async () => {
      // -> (Arrange)
      const updateUserDto: UpdateUserDto = { name: 'Novo nome' };
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      // -> (Act / Assert)
      await expect(
        userService.update(1, updateUserDto, tokenPayload),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao atualizar usuário!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw UNAUTHORIZED exception when user is not authorized', async () => {
      // -> (Arrange)
      const updateUserDto: UpdateUserDto = { name: 'Novo nome' };
      const tokenPayload: PayloadTokenDto = {
        sub: 5,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const mockUser = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
        Task: [],
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      // -> (Act / Assert)
      await expect(
        userService.update(1, updateUserDto, tokenPayload),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao atualizar usuário!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should user updated', async () => {
      // -> (Arrange)
      const updateUserDto: UpdateUserDto = {
        name: 'Novo nome',
        password: 'nova senha',
      };
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const mockUser = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      const updatedUser = {
        id: 1,
        name: 'Novo nome',
        email: 'dimas@teste.com',
        avatar: null,
        passwordHash: 'novo_hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(hashingService, 'hash').mockResolvedValue('novo_hash_exemplo');
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      // -> (Act)
      const result = await userService.update(1, updateUserDto, tokenPayload);

      // -> (Assert)
      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: updateUserDto.name,
          passwordHash: 'novo_hash_exemplo',
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      expect(result).toEqual(updatedUser);
    });
  });

  describe('Delete user', () => {
    it('should throw error when user is not found', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      // -> (Act / Assert)
      await expect(userService.delete(1, tokenPayload)).rejects.toThrow(
        new HttpException('Falha ao deletar usuário!', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw UNAUTHORIZED when user is not authorized', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 5,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const mockUser = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      // -> (Act / Assert)
      await expect(
        userService.delete(mockUser.id, tokenPayload),
      ).rejects.toThrow(
        new HttpException('Falha ao deletar usuário!', HttpStatus.BAD_REQUEST),
      );

      expect(prismaService.user.delete).not.toHaveBeenCalled();
    });

    it('should delete user', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const mockUser = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser);

      // -> (Act)
      const result = await userService.delete(mockUser.id, tokenPayload);

      // -> (Assert)
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });

      expect(result).toEqual({
        message: 'Usuário foi deletado com sucesso!',
      });
    });
  });

  describe('Upload Avatar User', () => {
    it('should throw NOT_FOUND when user is not found', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const file = {
        originalname: 'avatar.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      // -> (Act / Assert)
      await expect(
        userService.uploadAvatarImage(tokenPayload, file),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao atualizar o avatar do usuário!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should upload avatar and update user sucessfully', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const file = {
        originalname: 'avatar.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      const mockUser: any = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
      };

      const updateUser: any = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: '1.png',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateUser);
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      // -> (Act)
      const result = await userService.uploadAvatarImage(tokenPayload, file);

      const fileLocale = path.resolve(process.cwd(), 'files', '1.png');

      // -> (Assert)
      expect(fs.writeFile).toHaveBeenCalledWith(fileLocale, file.buffer);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
        data: {
          avatar: '1.png',
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      });

      expect(result).toEqual(updateUser);
    });

    it('should throw error if file fails', async () => {
      // -> (Arrange)
      const tokenPayload: PayloadTokenDto = {
        sub: 1,
        aud: '',
        email: 'dimas@teste.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      const file = {
        originalname: 'avatar.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      const mockUser: any = {
        id: 1,
        name: 'Dimas',
        email: 'dimas@teste.com',
        avatar: null,
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest
        .spyOn(fs, 'writeFile')
        .mockRejectedValue(new Error('File write error'));

      // -> (Act / Assert)
      await expect(
        userService.uploadAvatarImage(tokenPayload, file),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao atualizar o avatar do usuário!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
