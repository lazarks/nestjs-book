import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationMiddleware } from './shared/middlewares/authentication.middleware';
import { strategy } from './shared/config/passport-strategy.config';
import { EntryModule } from './modules/entry/entry.module';
import { CommentModule } from './modules/comment/comment.module';
import { KeywordModule } from './modules/keyword/keyword.module';
import { UserGatewayModule } from './gateways/user/user.gateway.module';
import { CommentGatewayModule } from './gateways/comment/comment.gateway.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserService } from './modules/user/user.service';
import { EntryController } from './modules/entry/entry.controller';
import { CommentController } from './modules/comment/comment.controller';

@Module({
  imports: [
    DatabaseModule,
    AuthenticationModule.forRoot('jwt'),
    UserModule,
    EntryModule,
    CommentModule,
    UserGatewayModule,
    CommentGatewayModule,
    KeywordModule,
  ],
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
      .forRoutes(
        ...userControllerAuthenticatedRoutes,
        EntryController,
        CommentController,
      );
  }
}
