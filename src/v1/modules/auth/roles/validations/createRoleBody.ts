import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ICreateRoleDto } from '../dtos/createRoleDto';

export class CreateRoleBody implements ICreateRoleDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'permission name is too short!',
  })
  @MaxLength(60, {
    message: 'permission name is too long!',
  })
  name: string;
}
