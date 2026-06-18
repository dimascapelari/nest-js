import { UsersController } from './users.controller';

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

  it('should Find All Users', async () => {
    await controller.findAllUsers();

    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });

  it('should Find One User', async () => {
    const userId = 1;

    await controller.findOneUser(userId);

    expect(usersServiceMock.findOne).toHaveBeenCalledWith(userId);
  });
});
