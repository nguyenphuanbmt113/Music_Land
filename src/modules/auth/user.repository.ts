import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enum/role.enum';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return await this.findOne({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({
      where: {
        username,
      },
    });
  }

  async hashPassword(password, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(emailLoginDto: any) {
    const { email, password } = emailLoginDto;
    const user = await this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: emailLoginDto.email })
      .getOne();
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    if (!user.password) {
      const errMessage = `You Cannot login from this gate, it's only for the main users,
      use the google or facebook gateways to login`;
      throw new ConflictException(errMessage, errMessage);
    }
    if (await user.validatePassword(password)) {
      delete user.password;
      return { email, user };
    } else {
      throw new BadRequestException(
        'Your Password in incorrect, please enter another one',
      );
    }
  }

  async validateAdminPassword(emailLoginDto: any) {
    const { email, password } = emailLoginDto;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    const isAdmin = (): boolean =>
      user.roles.some((role) => role === Role.ADMIN);
    if (!isAdmin()) {
      throw new ForbiddenException('This Resource Is Forbidden');
    }
    if (user && (await user.validatePassword(password))) {
      return { email, user };
    } else {
      throw new BadRequestException(
        'Your Password in incorrect, please enter another one',
      );
    }
  }
}
