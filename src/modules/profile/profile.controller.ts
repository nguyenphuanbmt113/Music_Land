import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './files/avatar',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const nameExtension = file.originalname.split('.')[1];
        const newName =
          name.split(' ').join('_') + '_' + Date.now() + '.' + nameExtension;
        cb(null, newName);
      },
    }),
  }),
)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('user-profile')
  getUserProfile(@UserDecorator() user: User) {
    return this.profileService.getProfileData(user);
  }

  @Post('user-profile/set-profile-image')
  setProfileImage(@UserDecorator() user: User, @UploadedFile() image: any) {
    return this.profileService.setProfileImage(user, image);
  }

  @Patch('user-profile/change-profile-image')
  changeProfileImage(@UserDecorator() user: User, @UploadedFile() image: any) {
    return this.profileService.changeProfileImage(user, image);
  }

  @Put('user-profile/edit-profile')
  editProfile(@UserDecorator() user: User, @Body() createProfileDto: any) {
    return this.profileService.editProfile(user, createProfileDto);
  }

  @Delete('user-profile/delete-profile-image')
  deleteProfileImage(@UserDecorator() user: User) {
    return this.profileService.deleteProfileImage(user);
  }
}
