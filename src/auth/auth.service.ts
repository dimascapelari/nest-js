import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private prisnma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async authenticate(signInDto: SignInDto) {
    const user = await this.prisnma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new HttpException('Falha ao fazer login', HttpStatus.UNAUTHORIZED);
    }

    const passordIsValid = await this.hashingService.compare(
      signInDto.password,
      user.passwordHash,
    );

    if (!passordIsValid) {
      throw new HttpException(
        'Senha/Usuário incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
