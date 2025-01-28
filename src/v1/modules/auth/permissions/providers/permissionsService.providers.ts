import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { PermissionsService } from '../services/permissions.service';

export const permissionsServiceProviders = [
  {
    provide: PERMISSIONS_SERVICE_PROVIDER_NAME,
    useClass: PermissionsService,
  },
];
