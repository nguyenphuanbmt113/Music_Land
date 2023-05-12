import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt-stragety';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { EmailVerification } from 'src/entities/email-verify.entity';
import { MailModule } from '../mail/mail.module';
import { ForgottenPassword } from 'src/entities/password-forgot.entity';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User, EmailVerification, ForgottenPassword]),
    JwtModule.register({
      secret: 'secretStringThatNoOneCanGuess',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '1d',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRepository],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
