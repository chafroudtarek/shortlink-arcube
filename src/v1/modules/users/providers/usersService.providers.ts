import { USERS_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { UsersService } from '../services/users.service';

export const usersServiceProvider = [
  {
    provide: USERS_SERVICE_PROVIDER_NAME,
    useClass: UsersService,
  },
];
