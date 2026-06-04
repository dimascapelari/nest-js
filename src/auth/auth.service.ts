import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisnma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    // console.log(jwtConfiguration);
  }

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
