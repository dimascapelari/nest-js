import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../auth/common/auth.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // -> Listar todos os usuários
  @Get()
  findAllTasks() {
    return this.userService.findAll();
  }

  // -> Buscar os detalhes de 1 usuário
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    console.log('Token teste: ', process.env.TOKEN_KEY);

    return this.userService.findOne(id);
  }

  // -> Cadastrar usuário
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // -> Atualizar um usuário específico
  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    console.log('ID user: ', (req as any)[REQUEST_TOKEN_PAYLOAD_NAME]?.sub);
    return this.userService.update(id, updateUserDto);
  }

  // -> Deletar usuário
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
