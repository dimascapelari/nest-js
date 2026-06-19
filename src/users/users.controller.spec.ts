import * as fs from 'node:fs/promises';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';

// Faz o Jest substituir o módulo de arquivos por mocks,
// assim o teste não escreve nada de verdade no disco.
jest.mock('node:fs/promises');

describe('Users Controller', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    uploadAvatarImage: jest.fn(),
  };

  beforeEach(() => {
    controller = new UsersController(usersServiceMock as any);
  });

  // ----------   => Padrão AAA   ---------------------

  //     > Configuração do teste (Arrange)
  //     > Algo que deseja fazer a ação (Act)
  //     > Conferir se a ação foi esperada (Assert)

  it('should Find All Users', async () => {
    // Act
    await controller.findAllUsers();

    // Assert
    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });

  it('should Find One User', async () => {
    // Arrange
    const userId = 1;

    // Act
    await controller.findOneUser(userId);

    // Assert
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(userId);
  });

  it('should create a new user', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      name: 'Dimas',
      email: 'dimas@email.com',
      password: '123456',
    };

    const mockUser = {
      name: 'Dimas',
      email: 'dimas@email.com',
      password: '123456',
    };

    usersServiceMock.create.mockResolvedValue(mockUser);

    // Act
    const result = await controller.createUser(createUserDto);

    // Assert
    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should update user', async () => {
    // Arrange
    const userId = 1;

    const updateUserDto: UpdateUserDto = {
      name: 'Dimas Novo',
    };

    const tokenPayload: PayloadTokenDto = {
      sub: userId,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: '',
    };

    const updatedUser = {
      id: userId,
      name: 'Dimas Novo',
      email: 'dimas@email.com',
    };

    (usersServiceMock.update as jest.Mock).mockResolvedValue(updatedUser);

    // Act
    const result = await controller.updateUser(
      userId,
      updateUserDto,
      tokenPayload,
    );

    // Assert
    expect(usersServiceMock.update).toHaveBeenCalledWith(
      userId,
      updateUserDto,
      tokenPayload,
    );

    expect(result).toEqual(updatedUser);
  });

  it('should delete user', async () => {
    // Arrange
    const userId = 1;

    const tokenPayload: PayloadTokenDto = {
      sub: userId,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: '',
    };

    // Act
    await controller.deleteUser(userId, tokenPayload);

    // Assert
    expect(usersServiceMock.delete).toHaveBeenCalledWith(userId, tokenPayload);
  });

  it('should upload avatar', async () => {
    // Arrange
    const tokenPayload: PayloadTokenDto = {
      sub: 1,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: '',
    };
    const mockFile = {
      originalname: 'avatar.png',
      mimetype: 'image/png',
      buffer: Buffer.from('mock'),
    } as Express.Multer.File;

    // Act
    await controller.uploadAvatar(tokenPayload, mockFile);

    // Assert
    expect(usersServiceMock.uploadAvatarImage).toHaveBeenCalledWith(
      tokenPayload,
      mockFile,
    );
  });

  it('should upload files', async () => {
    // Arrange
    const tokenPayload: PayloadTokenDto = {
      sub: 1,
      aud: '',
      email: '',
      exp: 1,
      iat: 1,
      iss: '',
    };
    const mockFile1 = {
      originalname: 'avatar.png',
      mimetype: 'image/png',
      buffer: Buffer.from('mock'),
    } as Express.Multer.File;

    const mockFile2 = {
      originalname: 'documento.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('mock'),
    } as Express.Multer.File;

    // Act
    const result = await controller.uploadVariosArquivos(tokenPayload, [
      mockFile1,
      mockFile2,
    ]);

    // Assert
    expect(result).toBe(true);
    expect(fs.writeFile).toHaveBeenCalledTimes(2);
  });
});
