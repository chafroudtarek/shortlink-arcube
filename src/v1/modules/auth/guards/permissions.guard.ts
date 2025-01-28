import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ILogger } from 'src/v1/modules/core/logger/logger.interface';
import { LOGGER_PROVIDER_NAME } from 'src/v1/modules/core/providers.constants';
import { USERS_REPO_PROVIDER_NAME } from 'src/v1/modules/database/providers.constants';
import { IUsersRepository } from 'src/v1/modules/database/repositories/user.repository';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    private readonly _reflector: Reflector,
    @Inject(USERS_REPO_PROVIDER_NAME)
    private readonly _usersRepo: IUsersRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this._reflector.get<string[]>('permissions', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // const result = await this._usersRepo.findOne({
    //   filter: { _id: user.id },
    //   populate: {
    //     path: 'roles',
    //     select: 'name permissions',
    //     populate: [{ path: 'permissions', select: 'name' }],
    //   },
    // });

    // for (const userRole of result.roles) {
    //   for (const permission of userRole.permissions) {
    //     if (roles.includes(permission.name)) {
    //       return true;
    //     }
    //   }
    // }
    const result = await this._usersRepo.doesUserHavePermission(user.id, permissions);
    return result;
  }
}
