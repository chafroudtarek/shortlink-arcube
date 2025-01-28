import { ApiResponse } from '@nestjs/swagger';
import { InternalServerErrorResponse } from '../errorResponses/internalServerErrorResponse';
export const ApiGenericInternalServerErrorResponse = () => {
  return ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: InternalServerErrorResponse,
  });
};
