import { IsString, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlValidation {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/very/long/url',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL format' })
  @MaxLength(2000)
  originalUrl: string;
}
