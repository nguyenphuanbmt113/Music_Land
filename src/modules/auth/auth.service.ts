import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/common/enum/role.enum';
import { Profile } from 'src/entities/profile.entity';
import { Favorite } from 'src/entities/favorite.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  //login
  async login(emailDtoLogin: any): Promise<{ token: string; user: User }> {
    if (!this.isValidEmail(emailDtoLogin.email)) {
      throw new BadRequestException('Invalid Email Signature');
    }
    const { email, user } = await this.userRepository.validatePassword(
      emailDtoLogin,
    );
    const payload = {
      email: email,
      id: user.id,
    };
    const token = this.generalToken(payload);
    return {
      token,
      user,
    };
  }

  //register
  async register(createUserDto: any, createProfileDto: any) {
    const { username, email, password } = createUserDto;
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('You have entered invalid email');
    }
    const user = new User();
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
    user.roles = [Role.USER];
    user.password = password;
    user.profile = await this.createProfile(user, createProfileDto);
    user.playlists = [];

    await this.userRepository.save(user);
    return user;
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
  isValidEmail(email: string) {
    if (email) {
      const pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    } else return false;
  }
  //check username
  async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    return count >= 1;
  }
  //ganeral jwt toke
  generalToken(payload: any) {
    const token = this.jwt.sign(payload);
    return token;
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
}
