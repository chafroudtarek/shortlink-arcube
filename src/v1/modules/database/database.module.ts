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
import { urlsRepositoryProviders } from './providers/url/urls.repo.providers';
import { urlsMongooseRepoProviders } from './providers/url/urls.mongoose.repo.providers';

@Global()
@Module({
  providers: [
    ...databaseProviders,
    ...usersMongooseRepoProviders,
    ...urlsMongooseRepoProviders,
    ...usersRepositoryProviders,
    ...urlsRepositoryProviders,
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
    ...urlsMongooseRepoProviders,
    ...usersRepositoryProviders,
    ...urlsRepositoryProviders,
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
