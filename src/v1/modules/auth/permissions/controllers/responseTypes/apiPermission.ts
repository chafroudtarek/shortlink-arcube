import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../permissions.interface';

export class ApiPermission extends Permission {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
