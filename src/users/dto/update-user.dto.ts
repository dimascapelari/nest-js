import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// extends PartialType -> traz todas as propriedades do CreateUserDto

export class UpdateUserDto extends PartialType(CreateUserDto) {}
