import { Connection } from 'mongoose';
import { accountVerificationSchema } from '../../models/accountVerification.model';
import {
  ACCOUNT_VERIFICATIONS_ORM_REPOSITORY_PROVIDER_NAME,
  DATABASE_PROVIDER_NAME,
} from '../../providers.constants';

export const accountVerificationsOrmRepoProviders = [
  {
    provide: ACCOUNT_VERIFICATIONS_ORM_REPOSITORY_PROVIDER_NAME,
    useFactory: (connection: Connection) => {
      return connection.model('accountverifications', accountVerificationSchema);
    },
    inject: [DATABASE_PROVIDER_NAME],
  },
];
