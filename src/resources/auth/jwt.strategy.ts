import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { jwtConstants, Role } from 'src/helpers/constants';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { roles } = payload;
    const service = roles.includes(Role.SU_ADMIN)
      ? this.accountService
      : this.userService;
    const { pin, password, ...result } = await service.findOne(payload?._id);
    return result;
  }
}
