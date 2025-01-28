import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './providers/database.providers';
import { usersMongooseRepoProviders } from './providers/users/users.mongoose.repo.providers';
import { usersRepositoryProviders } from './providers/users/users.repo.providers';
import { permissionsMongooseRepoProviders } from './providers/permissions/permissions.mongoose.repo.providers';
import { permissionsRepositoryProviders } from './providers/permissions/permissions.repo.providers';
import { rolesMongooseRepoProviders } from './providers/roles/roles.mongoose.repo.providers';
import { rolesRepositoryProviders } from './providers/roles/roles.repo.providers';
import { loggerProviders } from '../core/logger/logger.providers';
import { unitOfWorkProviders } from './helpers/unitOfWork/unitOfWork.providers';
import { asyncTransactionSessionProviders } from './helpers/unitOfWork/asyncTransactionSession.providers';

@Global()
@Module({
  providers: [
    ...databaseProviders,
    ...usersMongooseRepoProviders,
    ...usersRepositoryProviders,
    ...permissionsMongooseRepoProviders,
    ...permissionsRepositoryProviders,
    ...rolesMongooseRepoProviders,
    ...rolesRepositoryProviders,
    ...loggerProviders,
    ...asyncTransactionSessionProviders,
    ...unitOfWorkProviders,
  ],
  exports: [
    ...databaseProviders,
    ...usersMongooseRepoProviders,
    ...usersRepositoryProviders,
    ...permissionsMongooseRepoProviders,
    ...permissionsRepositoryProviders,
    ...rolesMongooseRepoProviders,
    ...rolesRepositoryProviders,
    ...loggerProviders,
    ...asyncTransactionSessionProviders,
    ...unitOfWorkProviders,
  ],
})
export class DatabaseModule {}
