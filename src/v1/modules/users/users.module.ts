import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create.controller';
import { QueryParserMiddleware } from 'src/v1/modules/shared/middlewares/parseQuery.middleware';
import { usersServiceProvider } from './providers/usersService.providers';
import { usersProfileServiceProvider } from './providers/usersProfileService.providers';
import { GetUsersController } from './controllers/getAll.controller';

@Module({
  controllers: [GetUsersController, CreateUserController],
  providers: [...usersServiceProvider, ...usersProfileServiceProvider],
  exports: [],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryParserMiddleware).forRoutes(GetUsersController);
  }
}
