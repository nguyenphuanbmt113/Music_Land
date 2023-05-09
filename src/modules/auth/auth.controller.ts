import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/register-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    const { token, user } = await this.authService.login(
      loginDto as UserLoginDto,
    );
    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    return res.send({ success: true, user });
  }

  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(200).send({ success: true });
  }
}
