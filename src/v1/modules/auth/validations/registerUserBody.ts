import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsDefined,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ICreateUserDto } from '../../users/dtos/createUserDto';

export class RegisterUserBody implements ICreateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'First name is too short!',
  })
  @MaxLength(50, {
    message: 'First name is too long!',
  })
  firstName: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Last name is too short!',
  })
  @MaxLength(50, {
    message: 'Last name is too long!',
  })
  lastName: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Username is too short!',
  })
  @MaxLength(50, {
    message: 'Username is too long!',
  })
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Password is too short!',
  })
  @MaxLength(16, {
    message: 'Password is too long!',
  })
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Password is too short!',
  })
  @MaxLength(16, {
    message: 'Password is too long!',
  })
  verify_password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  // @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, {
  //   message: 'Phone number must be valid!',
  // })
  phone?: string;

  @ApiProperty({
    required: false,
  })
  age?: number;

  @ApiProperty({
    required: false,
  })
  birthDate?: Date;
}
