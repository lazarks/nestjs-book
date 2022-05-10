import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userProvider } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [userProvider, UserService],
  exports: [UserService],
})
export class UserModule {}
