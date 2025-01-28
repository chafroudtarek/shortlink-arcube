import { PERMISSIONS_REPO_PROVIDER_NAME } from '../../providers.constants';
import { PermissionsRepository } from '../../repositories/permissions.repository';

export const permissionsRepositoryProviders = [
  {
    provide: PERMISSIONS_REPO_PROVIDER_NAME,
    useClass: PermissionsRepository,
  },
];
