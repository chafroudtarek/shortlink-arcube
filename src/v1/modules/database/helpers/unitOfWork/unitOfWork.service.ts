import { ILogger } from 'src/v1/modules/core/logger/logger.interface';
import { IUnitOfWork } from './unitOfWork.interface';
import { LOGGER_PROVIDER_NAME } from 'src/v1/modules/core/providers.constants';
import {
  DATABASE_PROVIDER_NAME,
  MONGO_TRANSACTION_SESSION_PROVIDER_NAME,
} from '../../providers.constants';
import { ClientSession, Connection, Model } from 'mongoose';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { IUsersRepository, UsersRepository } from '../../repositories/user.repository';
import { IUserModel, userSchema } from '../../models/user.model';
import {
  IPermissionsRepository,
  PermissionsRepository,
} from '../../repositories/permissions.repository';
import { IPermissionModel, permissionSchema } from '../../models/permission.model';
import { IRolesRepository, RolesRepository } from '../../repositories/role.repository';
import { IRoleModel, roleSchema } from '../../models/role.model';
import {
  AccountVerificationsRepository,
  IAccountVerificationsRepository,
} from '../../repositories/accountVerification.repository';
import {
  IAccountVerificationModel,
  accountVerificationSchema,
} from '../../models/accountVerification.model';

@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork implements IUnitOfWork {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) public _logger: ILogger,
    @Inject(DATABASE_PROVIDER_NAME) private readonly _dbConnection: Connection,
    @Inject(MONGO_TRANSACTION_SESSION_PROVIDER_NAME) private readonly _session: ClientSession,
  ) {}
  async startTransaction() {
    this._session.startTransaction();
  }
  async commitChanges() {
    await this._session.commitTransaction();
    await this._session.endSession();
  }
  async rollbackChanges() {
    await this._session.abortTransaction();
    await this._session.endSession();
  }
  provideUsersRepository(): IUsersRepository {
    const usersRepository = new UsersRepository(
      this._logger,
      this._dbConnection.model('users', userSchema) as unknown as Model<IUserModel>,
    );
    usersRepository.setSession(this._session);
    return usersRepository;
  }
  providePermissionsRepository(): IPermissionsRepository {
    const permissionsRepository = new PermissionsRepository(
      this._logger,
      this._dbConnection.model(
        'permissions',
        permissionSchema,
      ) as unknown as Model<IPermissionModel>,
    );
    permissionsRepository.setSession(this._session);
    return permissionsRepository;
  }
  provideRolesRepository(): IRolesRepository {
    const rolesRepository = new RolesRepository(
      this._logger,
      this._dbConnection.model('roles', roleSchema) as unknown as Model<IRoleModel>,
    );
    rolesRepository.setSession(this._session);
    return rolesRepository;
  }
  provideAccountVerificationRepository(): IAccountVerificationsRepository {
    const accountsVerificationsRepository = new AccountVerificationsRepository(
      this._logger,
      this._dbConnection.model(
        'accountsverifications',
        accountVerificationSchema,
      ) as unknown as Model<IAccountVerificationModel>,
    );
    accountsVerificationsRepository.setSession(this._session);
    return accountsVerificationsRepository;
  }
}
