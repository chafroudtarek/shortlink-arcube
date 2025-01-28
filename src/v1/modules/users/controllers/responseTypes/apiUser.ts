import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users.interface';

export class ApiUser extends User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  username: string;
}
