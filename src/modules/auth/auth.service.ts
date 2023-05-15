import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enum/role.enum';
import { EmailVerification } from 'src/entities/email-verify.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { ForgottenPassword } from 'src/entities/password-forgot.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { PlaylistService } from '../playlist/playlist.service';
import { ProfileService } from '../profile/profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/register-user.dto';
import { UserRepository } from './user.repository';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,

    @InjectRepository(EmailVerification)
    private emailVerificationRepo: Repository<EmailVerification>,

    @InjectRepository(ForgottenPassword)
    private forgottenPasswordRepo: Repository<ForgottenPassword>,

    private sendEmailService: MailService,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private jwt: JwtService,
  ) {}

  //check username
  async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    console.log('count:', count);
    return count >= 1;
  }
  //checkIfEmailExist
  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query
      .select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }
  //login
  async login(
    emailDtoLogin: any,
  ): Promise<{ token: string; user: User; refresh_token: string }> {
    const { email, user } = await this.userRepository.validatePassword(
      emailDtoLogin,
    );
    const payload = {
      email: email,
      id: user.id,
    };
    const token = this.generalToken(payload);
    const refresh_token = this.jwt.sign({
      payload,
      secret: 'secretStringThatNoOneCanGuess',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '3d',
      },
    });
    user.refresh_token = refresh_token;
    await user.save();
    return {
      refresh_token,
      token,
      user,
    };
  }
  async signInAdmin(
    emailDtoLogin: any,
  ): Promise<{ token: string; user: User; refresh_token: string }> {
    const { email, user } = await this.userRepository.validateAdminPassword(
      emailDtoLogin,
    );
    const payload = {
      email: email,
      id: user.id,
    };
    const token = this.generalToken(payload);
    const refresh_token = this.jwt.sign({
      payload,
      secret: 'secretStringThatNoOneCanGuess',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '3d',
      },
    });
    user.refresh_token = refresh_token;
    return {
      token,
      user,
      refresh_token,
    };
  }
  //register
  async register(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    const { username, email, password, roles } = createUserDto;
    const user = new User();

    if (!this.isValidEmail(email)) {
      throw new ConflictException(
        `Email ${email} is not available, please try another one`,
      );
    }

    if (await this.isValidUsername(username)) {
      throw new ConflictException(
        `Username ${username} is not available, please try another one`,
      );
    } else {
      user.username = username;
    }

    if (await this.checkIfEmailExist(email)) {
      throw new ConflictException(
        `Email ${email} is not available, please try another one`,
      );
    } else {
      user.email = email;
    }
    user.roles = roles;
    user.password = password;
    user.profile = await this.createProfile(user, createProfileDto);
    user.playlists = [];
    await this.createTokenEmail(email);
    await this.sendEmailVerifucation(email);
    await user.save();
    return {
      success: 'register success',
      status: 200,
    };
  }

  //create profile
  async createProfile(user: User, createProfileDto: any): Promise<Profile> {
    const { firstName, lastName, age, phone, gender, country, city, address } =
      createProfileDto;
    const profile = new Profile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.phone = phone;
    profile.gender = gender;
    profile.age = age;
    profile.country = country;
    profile.city = city;
    profile.address = address;
    profile.user = user;
    profile.favorite = await this.createFavoriteList(profile); // create a foreign key
    return await profile.save();
  }

  //create favorite list
  async createFavoriteList(profile: Profile): Promise<Favorite> {
    const favorite = new Favorite();
    favorite.profile = profile;
    favorite.tracks = [];
    return await favorite.save();
  }

  //Check Email có email
  async isValidEmail(email: string) {
    if (email) {
      const pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    } else return false;
  }

  //ganeral jwt toke
  generalToken(payload: any) {
    const token = this.jwt.sign(payload);
    return token;
  }
  //get user by id
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with Id ${id} Does not found`);
    }
    return user;
  }
  //edit role
  async editUserRoles(id: number, roles: Role[]): Promise<User> {
    const user = await this.getUserById(id);
    if (roles) {
      user.roles = roles;
    }
    return await this.userRepository.save(user);
  }
  //checkIfEmailExist
  async findEmail(email: string) {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query
      .select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }
  //create token email
  async createTokenEmail(email: string) {
    const verifuedEmail = await this.emailVerificationRepo.findOne({
      where: { email },
    });
    if (
      verifuedEmail &&
      (new Date().getTime() - verifuedEmail.timestamp.getTime()) / 60000 < 15
    ) {
      throw new HttpException(
        'LOGIN_EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const newEmailVerification = new EmailVerification();
      newEmailVerification.email = email;
      newEmailVerification.emailToken = (
        Math.floor(Math.random() * 900000) + 100000
      ).toString();
      newEmailVerification.timestamp = new Date();
      await newEmailVerification.save();
    }
  }

  async sendEmailVerifucation(email: string) {
    const verifiedEmail = await this.emailVerificationRepo.findOne({
      where: { email },
    });
    if (verifiedEmail && verifiedEmail.emailToken) {
      const url = `<a style='text-decoration:none;'
      href= http://localhost:1110/auth/verified-email/${verifiedEmail.emailToken}>Click Here to confirm your email</a>`;

      return await this.sendEmailService.sendEmailConfirmation(email, url);
    }
  }

  //verifiedEmail
  async verifiedEmail(token: string) {
    const verifiedEmail = await this.emailVerificationRepo.findOne({
      where: {
        emailToken: token,
      },
    });
    console.log('verifiedEmail:', verifiedEmail);
    if (verifiedEmail && verifiedEmail.email) {
      const user = await this.userRepository.findOne({
        where: {
          email: verifiedEmail.email,
        },
      });
      if (user) {
        user.isEmailVerified = true;
        await user.save();
        await verifiedEmail.remove();
        return { isFullyVerified: true, success: true };
      }
    } else {
      throw new HttpException(
        'LOGIN_EMAIL_CODE_NOT_VALID',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  //forgot password
  async forgotPassword(email: string) {
    //create token password
    const invalidForgotassword = await this.forgottenPasswordRepo.findOne({
      where: {
        email,
      },
    });
    const invaliddate =
      (new Date().getTime() - invalidForgotassword.timestamp.getTime()) /
        60000 <
      15;
    if (invalidForgotassword && invaliddate) {
      throw new HttpException(
        'PASSWORD_RESET_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const new_forgotPassword = new ForgottenPassword();
      new_forgotPassword.email = email;
      new_forgotPassword.timestamp = new Date();
      new_forgotPassword.newPasswordToken = Math.floor(
        Math.random() * 999999,
      ).toString();
      await new_forgotPassword.save();
      //send email
      await this.sendEmailForgotPassword(email);
      return 'send forgot password okale!';
    }
  }
  async sendEmailForgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    const invalidForgotassword = await this.forgottenPasswordRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('user do not exists');
    }
    if (invalidForgotassword && invalidForgotassword.newPasswordToken) {
      const url = `<a style='text-decoration:none;'
      href= http://localhost:1110/auth/forgot-password/${invalidForgotassword.newPasswordToken}>Click Here to change your password</a>`;
      await this.sendEmailService.sendEmailForgotPassword(email, url);
    }
  }
  //verify and change password
  async verifiedPassword(token: string, newPassword: string) {
    //verifid token
    const invalidForgotassword = await this.forgottenPasswordRepo.findOne({
      where: {
        newPasswordToken: token,
      },
    });
    if (invalidForgotassword) {
      const user = await this.userRepository.findOne({
        where: {
          email: invalidForgotassword.email,
        },
      });
      user.password = newPassword;
      await user.save();
      delete user.password;
      await invalidForgotassword.remove();
    }
  }
  //set new password
  async setPassword(email: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException('LOGIN_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    user.password = await this.hassPass(newPassword);
    await user.save();
    return true;
  }
  //check password
  async checkPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('User Does not Found', HttpStatus.NOT_FOUND);
    }
    return await bcrypt.compare(password, user.password);
  }
  //set new Password
  async setNewPassword(resetPasswordDto: any) {
    let isNewPasswordChanged = false;
    const { email, newPasswordToken, currentPassword, newPassword } =
      resetPasswordDto;
    if (email && currentPassword) {
      const isValidPassword = await this.checkPassword(email, currentPassword);
      if (isValidPassword) {
        isNewPasswordChanged = await this.setPassword(email, newPassword);
      } else {
        throw new HttpException(
          'RESET_PASSWORD_WRONG_CURRENT_PASSWORD',
          HttpStatus.CONFLICT,
        );
      }
    } else if (newPasswordToken) {
      const forgottenPassword = await this.forgottenPasswordRepo.findOne({
        where: {
          newPasswordToken,
        },
      });
      isNewPasswordChanged = await this.setPassword(
        forgottenPassword.email,
        newPassword,
      );
      if (isNewPasswordChanged) {
        await this.forgottenPasswordRepo.delete(forgottenPassword.id);
      }
    } else {
      return new HttpException(
        'RESET_PASSWORD_CHANGE_PASSWORD_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return isNewPasswordChanged;
  }
  async hassPass(password: string) {
    return await bcrypt.hashSync(password, 10);
  }
  //findAllUser
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    console.log('user:', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.remove();
    return {
      success: true,
      mes: 'delete success',
    };
  }
  //edit role user
  async editRole(userId: number, roles: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (roles) {
      user.roles = roles;
      await user.save();
    }
  }
  //delete account
  async deleteUserAccount(userId: number) {
    const user = await this.getUserById(userId);
    //delete playlist
    for (let i = 0; i < user.playlists.length; i++) {
      const playlistItem = user.playlists[i].id;
      await this.playlistService.deletePlaylist(playlistItem);
    }
    //delete profile
    await this.profileService.deleteProfile(user.profileId);
    await user.remove();
    return 'delete okela';
  }
  //fresh_token
  async refresh_token(refresh_token_cookie: string) {
    //verified token
    const verified_token = await this.jwt.verify(refresh_token_cookie);
    //check refresh_token
    const user = await this.userRepository.findOne({
      where: {
        refresh_token: refresh_token_cookie,
        id: verified_token.id,
      },
    });
    const payload = {
      email: user.email,
      id: user.id,
    };
    if (user) {
      return {
        new_token: this.generalToken(payload),
      };
    }
  }
}
