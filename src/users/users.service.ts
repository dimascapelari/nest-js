import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // -> Listar todos os usuários
  async findAll() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers;
  }

  // -> Buscar os detalhes de 1 usuário
  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },

      select: {
        // select traz somente os dados selecionados para serem exibidos
        id: true,
        name: true,
        email: true,
        Task: true,
      },
    });

    if (user) return user;

    throw new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST);
  }

  // -> Cadastrar usuário
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
        },

        // select traz somente os dados selecionados para serem exibidos
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // -> Atualizar um usuário específico
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuário não existe!', HttpStatus.BAD_REQUEST);
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: updateUserDto.name ? updateUserDto.name : user.name,
          passwordHash: updateUserDto.password
            ? updateUserDto.password
            : user.passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updateUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao atualizar usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // -> Deletar usuário
  async delete(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuário não existe!', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      return {
        message: 'Usuário foi deletado com sucesso!',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao deletar usuário!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
