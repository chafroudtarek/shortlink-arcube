import { Scope } from '@nestjs/common';
import { Connection } from 'mongoose';
import {
  DATABASE_PROVIDER_NAME,
  MONGO_TRANSACTION_SESSION_PROVIDER_NAME,
} from '../../providers.constants';

export const asyncTransactionSessionProviders = [
  {
    provide: MONGO_TRANSACTION_SESSION_PROVIDER_NAME,
    useFactory: async (databaseConnection: Connection) => {
      const connection = await databaseConnection.startSession();
      return connection;
    },
    scope: Scope.REQUEST,
    inject: [DATABASE_PROVIDER_NAME],
  },
];
