import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUserBody {
  @ApiProperty()
  @IsDefined()
  username: string;

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
}
