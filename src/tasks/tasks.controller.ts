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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DimasConsole } from './tasks.utils';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { TokenPayloadParam } from '../auth/param/token-payload.param';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tarefas')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    private readonly dimasConsole: DimasConsole,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Limete de tarefas a serem listadas',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Itens que deseja pular',
  })
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get('/dimas')
  @ApiOperation({ summary: 'Rota de teste' })
  getDimas() {
    console.log(this.dimasConsole.dimasContole());
    return this.taskService.getDimas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de uma tarefas' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.create(createTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma tarefa específica' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.update(id, updateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.delete(id, tokenPayload);
  }
}
