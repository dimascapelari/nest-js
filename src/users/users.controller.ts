import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// -> Deletar usuário
// -> Atualizar um usuário específico

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // -> Buscar os detalhes de 1 usuário
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // -> Cadastrar usuário
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
