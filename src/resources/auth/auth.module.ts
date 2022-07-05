import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { jwtConstants } from 'src/helpers/constants';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from 'src/providers/email/email.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '16h' },
    }),
  ],
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
