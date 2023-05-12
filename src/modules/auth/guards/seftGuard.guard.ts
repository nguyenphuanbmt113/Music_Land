import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';

@Injectable()
export class SeftAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const seftUser: User = req.user;
    if (seftUser) {
      const userId = seftUser.id;
      const findUser = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (!findUser) {
        throw new BadRequestException('User can not found');
      }
      return true;
    } else {
      return false;
    }
  }
}
