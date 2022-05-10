import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {
  static forRoot(strategy?: 'jwt'): DynamicModule {
    strategy = strategy ? strategy : 'jwt';

    let strategyProvider = {
      provide: 'Strategy',
      useFactory: async (authenticationService: AuthenticationService) => {
        let Strategy = (await import(`./passports/${strategy}.strategy`))
          .default;
        return new Strategy(authenticationService);
      },
    };

    return {
      module: AuthenticationModule,
      imports: [UserModule],
      controllers: [AuthenticationController],
      providers: [AuthenticationService, strategyProvider],
      exports: [strategyProvider],
    };
  }
}
