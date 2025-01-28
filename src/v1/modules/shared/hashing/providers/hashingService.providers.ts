import { HASHING_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { HashingService } from '../services/hashing.service';

export const hashingServiceProviders = [
  {
    useClass: HashingService,
    provide: HASHING_SERVICE_PROVIDER_NAME,
  },
];
