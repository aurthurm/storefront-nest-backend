import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  /**
   * Reset Password
   * @param payload
   * @param req
   * @returns
   */
  @Post('reset-password')
  resetPassword(@Body() payload: any, @Request() req) {
    const { email } = payload;
    return this.authService.resetPassword(email, req);
  }

  @Post('new-password')
  newPassword(@Body() payload: any) {
    const { resetkey, password } = payload;
    return this.authService.newPassword(resetkey, password);
  }
}
