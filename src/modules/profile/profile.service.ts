import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async getProfileData(user: User): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profileId,
      },
    });
    if (!profile) {
      throw new NotFoundException('profile does not found');
    }
    return profile;
  }
  async editProfile(user: User, createProfileDto: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    const { firstName, lastName, phone, age, address, city, country, gender } =
      createProfileDto;
    if (firstName) {
      console.log(firstName);
      profile.firstName = firstName;
    }
    if (lastName) {
      profile.lastName = lastName;
    }
    if (phone) {
      profile.phone = phone;
    }
    if (age) {
      profile.age = age;
    }
    if (address) {
      profile.address = address;
    }
    if (city) {
      profile.city = city;
    }
    if (country) {
      profile.country = country;
    }
    if (gender) {
      profile.gender = gender;
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }
  async deleteProfile(id: number): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('profile does not found');
    }
  }
  async setProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      profile.image = `http://localhost:5400/post/photos/${image.filename}`;
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }
  async changeProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      profile.image = `http://localhost:5400/profile/photos/${image.filename}`;
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }
  async deleteProfileImage(user: User): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (!profile.image) {
      throw new ConflictException('the profile is already set to null!');
    }
    profile.image = null;
    const savedProfile = await profile.save();
    return savedProfile;
  }
}

/*
- localhost:3000/profiles --> Root Route (Main-Endpoint - Controller Name)
- localhost:3000/profiles/user-profile --> (GET Method)
- localhost:3000/profiles/user-profile/edit --> (PUT Method)
- localhost:3000/profiles/user-profile/set-profile-image --> (POST Method)
- localhost:3000/profiles/user-profile/delete-profile-image --> (DELETE Method)
- localhost:3000/profiles/user-profile/change-profile-image --> (PATCH Method)
*/
