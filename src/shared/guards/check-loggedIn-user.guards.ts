import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CheckLoggedInUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let req = context.switchToHttp().getRequest();
    return Number(req.params.userId) === req.user.id;
  }
}
