import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthServiceProvider } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from './passports/jwtAccess.strategy';
import { LocalStrategy } from './passports/local.strategy';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { RefreshTokensController } from './controllers/refreshTokens.controller';
import { RefreshJwtStrategy } from './passports/jwtRefresh.strategy';
import { JWT_CONFIG } from 'src/v1/config';
import { UserModule } from '../users/users.module';
import { CreatePermissionController } from './permissions/controllers/create.controller';
import { DeletePermissionByIdController } from './permissions/controllers/delete.controller';
import { GetPermissionByIdController } from './permissions/controllers/getById.controller';
import { GetPermissionsController } from './permissions/controllers/getAll.controller';
import { UpdatePermissionByIdController } from './permissions/controllers/updateById.controller';
import { permissionsServiceProviders } from './permissions/providers/permissionsService.providers';
import { GetRolesController } from './roles/controllers/getAll.controller';
import { GetRoleByIdController } from './roles/controllers/getById.controller';
import { UpdateRoleByIdController } from './roles/controllers/updateById.controller';
import { DeleteRoleByIdController } from './roles/controllers/delete.controller';
import { CreateRoleController } from './roles/controllers/create.controller';
import { GetMeController } from './controllers/getMe.controller';
import { LogoutController } from './controllers/logout.controller';
import { usersServiceProvider } from '../users/providers/usersService.providers';
import { usersProfileServiceProvider } from '../users/providers/usersProfileService.providers';
import { loggerProviders } from '../core/logger/logger.providers';
import { rolesServiceProviders } from './roles/providers/rolesService.providers';
import { QueryParserMiddleware } from '../shared/middlewares/parseQuery.middleware';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secretKey,
      signOptions: { expiresIn: JWT_CONFIG.accessExpiresIn },
    }),
  ],
  controllers: [
    RegisterController,
    LoginController,
    RefreshTokensController,
    GetMeController,
    LogoutController,
    CreatePermissionController,
    DeletePermissionByIdController,
    GetPermissionByIdController,
    GetPermissionsController,
    UpdatePermissionByIdController,
    GetRolesController,
    GetRoleByIdController,
    UpdateRoleByIdController,
    DeleteRoleByIdController,
    CreateRoleController,
  ],
  providers: [
    ...loggerProviders,
    ...usersServiceProvider,
    ...usersProfileServiceProvider,
    ...AuthServiceProvider,
    ...permissionsServiceProviders,
    ...rolesServiceProviders,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [...AuthServiceProvider],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryParserMiddleware).forRoutes(GetRolesController, GetPermissionsController);
  }
}
