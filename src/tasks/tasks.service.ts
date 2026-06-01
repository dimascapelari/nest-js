import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto ?? {};

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (task?.name) return task;

    throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND);
    // throw new HttpException('Essa tarefa não existe.', HttpStatus.BAD_REQUEST);
    // throw new NotFoundException('Essa tarefa NAO EXISTE!');
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: createTaskDto.userId,
        },
      });

      return newTask;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar tarefa',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id,
        },
      });

      if (!findTask) {
        throw new HttpException(
          'Essa tarefa não existe',
          HttpStatus.BAD_REQUEST,
        );
      }

      const task = await this.prisma.task.update({
        where: {
          id: findTask.id,
        },
        data: {
          name: updateTaskDto?.name ? updateTaskDto?.name : findTask.name,
          description: updateTaskDto?.description
            ? updateTaskDto?.description
            : findTask.description,
          completed: updateTaskDto?.completed
            ? updateTaskDto?.completed
            : findTask.completed,
        },
      });

      return task;
    } catch (error) {
      throw new HttpException(
        'Falha ao atualizar essa tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id,
        },
      });

      if (!findTask) {
        throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND);
      }

      await this.prisma.task.delete({
        where: {
          id: findTask.id,
        },
      });

      return {
        message: 'Tarefa deletada com sucesso!',
      };
    } catch (error) {
      throw new HttpException(
        'Falha ao deletar essa tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getDimas() {
    return 'Rota Dimas Tasks';
  }
}
