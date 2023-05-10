import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login-user.dto';
import { Role } from 'src/common/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFile, fileFilter } from 'src/common/helpers/handling-files.helper';
import { diskStorage } from 'multer';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login/user')
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.authService.login(
      loginDto as UserLoginDto,
    );
    return res.send({ success: true, user, token });
  }

  @Post('login/admin')
  async signInAdmin(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.authService.login(
      loginDto as UserLoginDto,
    );
    return res.send({ success: true, user, token });
  }

  @Post('register')
  async registerUser(@Body() body: any) {
    console.log('body:', body);
    const createUserDto = {
      email: body.email,
      password: body.password,
      username: body.username,
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

  @Get('all')
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

  @Post('email/reset-password')
  setNewPassword(@Body() resetPasswordDto: any) {
    return this.authService.setNewPassword(resetPasswordDto);
  }

  @Get('email/send-email-verification/:email')
  async sendEmailVerification(@Param('email') email: string) {
    await this.authService.createTokenEmail(email);
    return this.authService.sendEmailVerifucation(email);
  }

  @Delete('delete-user')
  deleteUser(@Param('id') id: number) {
    return this.authService.delete(id);
  }

  @Patch('edit-user-role/:userId')
  EditRole(@Param('userId') userId: number, @Body() roles: Role[]) {
    return this.authService.editRole(userId, roles);
  }

  @Get('user/:id')
  GetUserById(@Param('userId') userId: number) {
    return this.authService.getUserById(userId);
  }

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
    const res = file.filename;
    return {
      filePath: `http://localhost:1110/auth/avatar/${res}`,
    };
  }

  @Get('avatar/:pathfile')
  getAvatar(@Param('pathfile') pathfile: string, @Res() res: Response) {
    res.sendFile(pathfile, { root: './avatars' });
  }
}
