import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { TokenPayloadParam } from '../auth/param/token-payload.param';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';

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
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto,
  ) {
    console.log('PAYLOAD RECEBIDO: ', tokenPayloadParam);
    return this.userService.update(id, updateUserDto);
  }

  // -> Deletar usuário
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
