import { ApiProperty } from '@nestjs/swagger';
import { IGenericResponse } from 'src/types/genericResponse';

export class GenericResponse<T> implements IGenericResponse<T> {
  @ApiProperty()
  message: string;
  payload: T;
}
