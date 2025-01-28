import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, IsString } from 'class-validator';

export class VerifyAccountByEmailBody {
  @ApiProperty({
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  token: string;
}
