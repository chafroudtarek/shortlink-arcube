import { Connection } from 'mongoose';
import { userSchema } from '../../models/user.model';
import { USERS_ORM_REPO_PROVIDER_NAME } from '../../providers.constants';

export const usersMongooseRepoProviders = [
  {
    provide: USERS_ORM_REPO_PROVIDER_NAME,
    useFactory: (connection: Connection) => {
      return connection.model('users', userSchema);
    },
    inject: ['DATA_SOURCE'],
  },
];
