import { ROLES_REPO_PROVIDER_NAME } from '../../providers.constants';
import { RolesRepository } from '../../repositories/role.repository';

export const rolesRepositoryProviders = [
  {
    provide: ROLES_REPO_PROVIDER_NAME,
    useClass: RolesRepository,
  },
];
