import { ACCOUNT_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { AccountEmailVerificationService } from '../services/accountEmailVerification.service';

export const accountEmailVerificationServiceProviders = [
  {
    useClass: AccountEmailVerificationService,
    provide: ACCOUNT_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME,
  },
];
