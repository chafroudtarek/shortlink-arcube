import { ApiProperty } from '@nestjs/swagger';
import { ApiPaginationMetadata } from '../../paginator/apiResponseHelpers/apiPaginationMetadata';
import { IPaginationReturn } from '../../paginator/paginator.interface';

export class PaginatedResponse<T> implements IPaginationReturn<T> {
  @ApiProperty({
    type: ApiPaginationMetadata,
  })
  metadata: ApiPaginationMetadata;
  @ApiProperty()
  payload: T;
}
