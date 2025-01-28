import { USERS_REPO_PROVIDER_NAME } from '../../providers.constants';
import { UsersRepository } from '../../repositories/user.repository';

export const usersRepositoryProviders = [
  {
    provide: USERS_REPO_PROVIDER_NAME,
    useClass: UsersRepository,
  },
];
