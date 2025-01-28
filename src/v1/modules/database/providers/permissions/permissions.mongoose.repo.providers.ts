import { Connection } from 'mongoose';
import { permissionSchema } from '../../models/permission.model';
import { PERMISSIONS_ORM_REPO_PROVIDER_NAME } from '../../providers.constants';

export const permissionsMongooseRepoProviders = [
  {
    provide: PERMISSIONS_ORM_REPO_PROVIDER_NAME,
    useFactory: (connection: Connection) => {
      return connection.model('permissions', permissionSchema);
    },
    inject: ['DATA_SOURCE'],
  },
];
