import mongoose from 'mongoose';
import { DATABASE_CONFIG } from 'src/v1/config';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (logger: ILogger): Promise<typeof mongoose> => {
      const connection = await mongoose.connect(DATABASE_CONFIG.CONNECTION_URL);
      logger.log('Db', 'Connected To MongoDb');
      return connection;
    },
    inject: [LOGGER_PROVIDER_NAME],
  },
];
