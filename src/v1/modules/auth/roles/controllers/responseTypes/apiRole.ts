import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles.interface';

export class ApiRole extends Role {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
