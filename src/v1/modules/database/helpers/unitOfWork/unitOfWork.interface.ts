import { IAccountVerificationsRepository } from '../../repositories/accountVerification.repository';
import { IPermissionsRepository } from '../../repositories/permissions.repository';
import { IRolesRepository } from '../../repositories/role.repository';
import { IUsersRepository } from '../../repositories/user.repository';

export interface IUnitOfWork {
  provideUsersRepository(): IUsersRepository;
  providePermissionsRepository(): IPermissionsRepository;
  provideRolesRepository(): IRolesRepository;
  provideAccountVerificationRepository(): IAccountVerificationsRepository;
}
