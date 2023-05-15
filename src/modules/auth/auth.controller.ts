import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { Role } from 'src/common/enum/role.enum';
import { editFile, fileFilter } from 'src/common/helpers/handling-files.helper';
import { AuthService } from './auth.service';
import { Roles } from './decorator/role.decorator';
import { UserLoginDto } from './dto/login-user.dto';
import { AdminAuthGuard } from './guards/adminGuard.guard';
import { AuthenticationGuard } from './guards/jwt-guards.guard';
import { SeftAuthGuard } from './guards/seftGuard.guard';
import { UserDecorator } from './decorator/user.decorator';
import { User } from 'src/entities/user.entity';
import { CookieDecorator } from './decorator/cookie.decorator';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-user')
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    const { token, user, refresh_token } = await this.authService.login(
      loginDto as UserLoginDto,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return res.send({ success: true, user, token });
  }

  @Post('login/admin')
  async signInAdmin(@Body() loginDto: any, @Res() res: Response) {
    const { token, user, refresh_token } = await this.authService.signInAdmin(
      loginDto as UserLoginDto,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return res.send({ success: true, user, token });
  }

  @Post('register')
  async registerUser(@Body() body: any) {
    console.log('body:', body);
    const createUserDto = {
      email: body.email,
      password: body.password,
      username: body.username,
      roles: body.roles,
    };
    const createProfileDto = {
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      phone: body.phone,
      gender: body.gender,
      country: body.country,
      city: body.city,
      address: body.addres,
    };
    return await this.authService.register(createUserDto, createProfileDto);
  }

  @Get(':email')
  getEmail(@Param('email') email: string) {
    return this.authService.findEmail(email);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('verified-email/:token')
  verifiedEmailToRegister(@Param('token') token: string) {
    return this.authService.verifiedEmail(token);
  }

  @Get('forgot-password/:email')
  sendEmailForgotPassword(@Param('email') email: string) {
    return this.authService.sendEmailForgotPassword(email);
  }

  @UseGuards(AuthenticationGuard)
  @Post('email/reset-password')
  setNewPassword(@Body() resetPasswordDto: any) {
    return this.authService.setNewPassword(resetPasswordDto);
  }

  @Get('email/send-email-verification/:email')
  async sendEmailVerification(@Param('email') email: string) {
    await this.authService.createTokenEmail(email);
    return this.authService.sendEmailVerifucation(email);
  }

  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: number) {
    return this.authService.delete(id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('edit-user-role/:userId')
  EditRole(@Param('userId') userId: number, @Body() roles: Role[]) {
    return this.authService.editRole(userId, roles);
  }

  @Get('user/:id')
  GetUserById(@Param('userId') userId: number) {
    return this.authService.getUserById(userId);
  }

  @UseGuards(AuthenticationGuard, SeftAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFile,
      }),
      fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const res = file.path;
    return {
      filePath: res,
    };
  }

  @Get('avatar/:pathfile')
  getAvatar(@Param('pathfile') pathfile: string, @Res() res: Response) {
    res.sendFile(pathfile, { root: './avatars' });
  }

  @Delete('delete-user-account')
  @UseGuards(AuthenticationGuard, UseGuards)
  @Roles([Role.USER])
  deleteUserAccount(@UserDecorator() user: User) {
    return this.authService.deleteUserAccount(user.id);
  }

  @Post('refresh_token')
  async refresh_token(@CookieDecorator() refresh_token: string) {
    const result = await this.authService.refresh_token(refresh_token);
    return result;
  }
}
