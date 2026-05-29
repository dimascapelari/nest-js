/*

DTO = Data Transfer Object (Objeto de transferência de dados)

-> Validar dados, tranformar dados
-> Se us para reprensentar quais dados e em que formatos uma determinada camada aceita e trabalha

*/

import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'O nome precisa ser um texto' })
  @MinLength(5, { message: 'O nome precisa ter 5 caracteres' })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  readonly name!: string;

  @IsString()
  @MinLength(5, {
    message: 'A descrição precisa ser preenchida com pelo menos 5 caracteres',
  })
  @IsNotEmpty({ message: 'Descrição não pode ser vazia' })
  readonly description!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId!: number;
}
