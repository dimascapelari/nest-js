import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  AddHeaderInterceptor,
  BodyCreateTaskInteceptor,
  LoggerInterceptor,
} from '../common/interceptors';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get('/dimas')
  getDimas() {
    return this.taskService.getDimas();
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  @UseInterceptors(BodyCreateTaskInteceptor)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
