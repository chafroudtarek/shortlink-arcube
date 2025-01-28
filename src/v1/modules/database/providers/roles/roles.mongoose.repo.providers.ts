import { Connection } from 'mongoose';
import { roleSchema } from '../../models/role.model';
import { ROLES_ORM_REPO_PROVIDER_NAME } from '../../providers.constants';

export const rolesMongooseRepoProviders = [
  {
    provide: ROLES_ORM_REPO_PROVIDER_NAME,
    useFactory: (connection: Connection) => {
      return connection.model('roles', roleSchema);
    },
    inject: ['DATA_SOURCE'],
  },
];
