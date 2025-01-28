import { REQUEST_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { RequestAccountEmailVerificationService } from '../services/requestEmailVerification.service';

export const requestEmailVerificationServiceProviders = [
  {
    useClass: RequestAccountEmailVerificationService,
    provide: REQUEST_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME,
  },
];
