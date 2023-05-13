import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class AcceptAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    console.log('roles:', roles);
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const accept_auth: User = req.user;
    if (accept_auth) {
      const check_accept_auth = accept_auth.roles.some(
        (role) => role === Role.ADMIN || Role.USER,
      );
      if (check_accept_auth) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
