import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { AuthenticationMiddleware } from './shared/middlewares/authentication.middleware';
import { strategy } from './shared/config/passport-strategy.config';

@Module({
  imports: [AuthenticationModule.forRoot('jwt'), UserModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  // any -> middlewareconsumer
  public configure(consumer: any) {
    const userControllerAuthenticatedRoutes = [
      { path: '/users', method: RequestMethod.GET },
      { path: '/users/:id', method: RequestMethod.GET },
      { path: '/users/:id', method: RequestMethod.PUT },
      { path: '/users/:id', method: RequestMethod.DELETE },
    ];

    consumer
      .apply(AuthenticationMiddleware)
      .with(strategy)
      .forRoutes(...userControllerAuthenticatedRoutes);
  }
}
