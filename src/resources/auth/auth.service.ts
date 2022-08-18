import {
  UnauthorizedException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { UserService } from 'src/resources/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { EmailService } from 'src/providers/email/email.service';
import { AccountService } from '../account/account.service';
@Injectable()
export class AuthService {
  SALT_ROUNS = 10;
  constructor(
    private usersService: UserService,
    private accountService: AccountService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(req: any): Promise<any> {
    const { username, password, role } = req.body;
    const service = role == 'admin' ? this.accountService : this.usersService;
    const user = await service.findByEmailOrPhone(username);
    if (!user) return null;
    const isMatch =
      (await bcrypt.compare(password, user.pin)) ||
      (await bcrypt.compare(password, user.password));
    if (user && isMatch) {
      const updatedUser = new UpdateUserDto();
      updatedUser.lastLogin = new Date();
      service.update(user._id, updatedUser);
      const { pin, password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      _id: user?._id,
      phone: user?.phone,
      email: user?.email,
      roles: user?.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(email: string, request: Request, role: string) {
    const service = role == 'admin' ? this.accountService : this.usersService;
    const user = await service.findByEmailOrPhone(email);
    if (!user) {
      throw new NotFoundException(`User with email address ${email} not found`);
    }
    const resetKey = randomUUID();
    const resetUrl = request.headers.origin + '/new-password/' + resetKey;
    const updatedUser = new UpdateUserDto();
    updatedUser.resetPasswordKey = resetKey;
    updatedUser.resetPinKey = resetKey;
    updatedUser.lastPasswordReset = new Date();
    service.update(user._id, updatedUser);
    //send email to the user
    this.emailService.sendEmail();
  }

  async newPassword(resetkey: string, password: string, role: string) {
    const service = role == 'admin' ? this.accountService : this.usersService;
    const user = await service.findByResetKey(resetkey);
    if (user) {
      // check date diff 60000 are are seconds
      const now = +new Date();
      const { lastPasswordReset } = user;
      const diff = (now - +new Date(lastPasswordReset)) / 60000;
      //if greater that 15 minutes reject reset token
      if (diff > 15) {
        throw new UnauthorizedException('Resetlink Expired');
      }
      const updatedUser = new UpdateUserDto();
      updatedUser.resetPinKey = null;
      updatedUser.resetPasswordKey = null;
      updatedUser.password = password;
      updatedUser.pin = await bcrypt.hash(password, this.SALT_ROUNS);
      updatedUser.password = await bcrypt.hash(password, this.SALT_ROUNS);
      service.update(user._id, updatedUser);

      return { message: 'Password reset successfully' };
    }
    throw new UnauthorizedException('Invalid password reset link');
  }
}
