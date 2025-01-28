import { USERS_PROFILE_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { UsersProfileService } from '../services/userProfile.service';

export const usersProfileServiceProvider = [
  {
    provide: USERS_PROFILE_SERVICE_PROVIDER_NAME,
    useClass: UsersProfileService,
  },
];
