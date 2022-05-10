import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  createToken(email: string, ttl?: number) {
    let expiresIn = ttl || 60 * 60;
    let sercetOrKey = 'secret';
    let user = { email };
    let token = jwt.sign(user, sercetOrKey, { expiresIn });

    return { expires_in: expiresIn, access_token: token };
  }

  async validateUser(payload: {
    email: string;
    password: string;
  }): Promise<boolean> {
    let user = await this.userService.findOne({
      where: { email: payload.email },
    });
    return !!user;
  }
}
