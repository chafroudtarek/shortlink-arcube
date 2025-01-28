import { Body, Controller, HttpCode, Inject, Post, UseInterceptors } from '@nestjs/common';
import { IUsersService } from '../services/users.service';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResponse } from './responseTypes/create';
import { USERS_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageStorage } from '../../shared/storages/images.storage';
import { STORAGE_TYPES } from 'src/types/storageTypes';
import { TransferFileStaticPathToBodyInterceptor } from '../../shared/interceptors/transferFileStaticPathToBody.interceptor';
import { CreateUserBody } from '../validations/createUser.validation';

@ApiTags('Users')
@Controller({
  path: 'api/users',
  version: '1',
})
export class CreateUserController {
  constructor(@Inject(USERS_SERVICE_PROVIDER_NAME) private readonly _usersService: IUsersService) {}
  @ApiOperation({
    summary: 'Create User',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 201,
    description: 'Success',
    type: CreateUserResponse,
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: imageStorage,
    }),
    new TransferFileStaticPathToBodyInterceptor('picture', STORAGE_TYPES.IMAGES),
  )
  @HttpCode(201)
  async createUser(@Body() payload: CreateUserBody) {
    const result = await this._usersService.createUser(payload);
    return { message: 'Success', payload: result };
  }
}
