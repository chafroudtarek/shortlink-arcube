import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { RolesService } from '../services/roles.service';

export const rolesServiceProviders = [
  {
    provide: ROLES_SERVICE_PROVIDER_NAME,
    useClass: RolesService,
  },
];
