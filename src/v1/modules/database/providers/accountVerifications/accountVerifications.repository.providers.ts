import { ACCOUNT_VERIFICATIONS_REPOSITORY_PROVIDER_NAME } from '../../providers.constants';
import { AccountVerificationsRepository } from '../../repositories/accountVerification.repository';

export const accountVerificationsRepositoryProviders = [
  {
    useClass: AccountVerificationsRepository,
    provide: ACCOUNT_VERIFICATIONS_REPOSITORY_PROVIDER_NAME,
  },
];
