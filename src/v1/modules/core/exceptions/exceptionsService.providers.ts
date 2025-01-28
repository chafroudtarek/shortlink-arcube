import { EXCEPTIONS_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { ExceptionsService } from './exceptions.service';

export const exceptionsServiceProviders = [
  {
    provide: EXCEPTIONS_SERVICE_PROVIDER_NAME,
    useClass: ExceptionsService,
  },
];
