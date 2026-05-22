/*

DTO = Data Transfer Object (Objeto de transferência de dados)

-> Validar dados, tranformar dados
-> Se us para reprensentar quais dados e em que formatos uma determinada camada aceita e trabalha

*/

export class CreateTaskDto {
  readonly name!: string;
  readonly description!: string;
}
