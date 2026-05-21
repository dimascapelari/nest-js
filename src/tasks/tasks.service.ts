import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'Seguir o Sujeito Programador do Youtube',
      description: 'Aprendendo muito sobre programação',
      completed: false,
    },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: string) {
    return this.tasks.find((task) => task.id === Number(id));
  }

  create(body: any) {
    console.log('Tarefa criada com sucesso!');
    return body;
  }
}
