import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Private } from 'src/decorators/private.decorator';
import { DUser } from 'src/decorators/user.decorator';
import { UserLogInDto, UserSignUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserSignUpDto) {
    const accessToken = await this.authService.signUp(dto);
    return { accessToken };
  }

  @Post('log-in')
  async logIn(@Body() dto: UserLogInDto) {
    const accessToken = await this.authService.logIn(dto);
    return { accessToken };
  }

  @Get('refresh-token')
  @Private('user')
  async refreshToken(@DUser() user: User) {
    const accessToken = await this.authService.refreshToken(user);
    return accessToken;
  }
}
