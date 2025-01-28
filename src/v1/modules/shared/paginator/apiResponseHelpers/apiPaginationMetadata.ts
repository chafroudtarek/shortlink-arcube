import { ApiProperty } from '@nestjs/swagger';
import { IPaginationMetadata } from '../paginator.interface';

export class NeighborPagePaginationMetadata {
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
}
export class ApiPaginationMetadata implements IPaginationMetadata {
  @ApiProperty()
  total_items: number;
  @ApiProperty()
  rows_per_page: number;
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  last_page: number;
  @ApiProperty({
    type: NeighborPagePaginationMetadata,
  })
  next: NeighborPagePaginationMetadata;
  @ApiProperty({
    type: NeighborPagePaginationMetadata,
  })
  previous: NeighborPagePaginationMetadata;
}
