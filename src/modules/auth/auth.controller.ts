import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserLoginDto } from './dto/login-user.dto';
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

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(200).send({ success: true });
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
}
