import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  //   IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  // IsString -> seja um texto, IsNotEmpty -> nao seja um texto vazio
  @IsString()
  @IsNotEmpty()
  name!: string;

  // IsEmail -> seja um e-mail e seja string
  @IsEmail()
  email!: string;

  // IsStrongPassword -> estipula essas regras de senha

  //   @IsStrongPassword({
  //     minLength: 6,
  //     minLowercase: 1,
  //     minNumbers: 1,
  //     minUppercase: 1,
  //     minSymbols: 1,
  //   })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
