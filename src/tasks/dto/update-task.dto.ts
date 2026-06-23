import { IsBoolean, IsOptional } from 'class-validator';
// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

// export class UpdateTaskDto {
//   @IsString()
//   @IsOptional()
//   readonly name?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsBoolean()
//   @IsOptional()
//   readonly completed?: boolean;
// }

// npm install @nestjs/mapped-types

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}
