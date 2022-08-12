import { Injectable } from '@nestjs/common';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class BotAccountService {
  constructor(private userService: UserService) {}

  async createAccount(source: string, pin: string, active: boolean) {
    // rewuired for users created via listings
    const account = await this.userService.getUserBySource(source);
    if (account) return account;
    // create
    return await this.userService.createBotAccount(source, pin, active);
  }

  async activateAccount(source: string) {
    //
    return await this.toggleBotActive(source, true);
  }

  async deActivateAccount(source: string) {
    //
    return await this.toggleBotActive(source, false);
  }

  async toggleBotActive(source: string, active: boolean) {
    //
    const user = await this.userService.getUserBySource(source);
    return this.userService.update(user._id, { botActive: active });
  }

  async changeAccount(source: string, destination: string) {
    //Get user by source
    const user = await this.userService.getUserBySource(source);
    return this.userService.update(user._id, {
      waBotPhone: destination,
      botActive: true,
    });
  }

  async pinLogin(source: string, pin: string) {
    //
    const user = await this.userService.getUserBySource(source);
    return user.pin === pin;
  }

  async confirmPin(source: string, pin: string) {
    //
    const user = await this.userService.getUserBySource(source);
    if (user.pin === pin) {
      this.toggleBotActive(source, true);
      return true;
    }
    this.toggleBotActive(source, false);
    return false;
  }

  async checkIfAccountExists(source: string) {
    //
    return await this.userService.getUserBySource(source);
  }
}
