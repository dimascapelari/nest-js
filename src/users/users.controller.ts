import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { TokenPayloadParam } from '../auth/param/token-payload.param';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // -> Listar todos os usuários
  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  // -> Buscar os detalhes de 1 usuário
  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um usuário' })
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // -> Cadastrar usuário
  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // -> Atualizar um usuário específico
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.userService.update(id, updateUserDto, tokenPayload);
  }

  // -> Deletar usuário
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar um usuário',
    description: 'Remove permanentemente um usuário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário que será deletado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário foi deletado com sucesso!',
  })
  @ApiResponse({
    status: 400,
    description: 'Falha ao deletar usuário',
  })
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.userService.delete(id, tokenPayload);
  }

  // -> Imagem Avatar do usuário
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foto do usuário' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 3 * (1024 * 1024), // tamanho máximo 3 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatarImage(tokenPayload, file);
  }

  // -> Vários Arquivos (Teste)
  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('uploads')
  async uploadVariosArquivos(
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    files.forEach(async (file) => {
      const fileExtension = path
        .extname(file.originalname)
        .toLowerCase()
        .substring(1);

      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileLocale = path.resolve(process.cwd(), 'files', fileName);
      await fs.writeFile(fileLocale, file.buffer);
    });

    return true;
  }
}
