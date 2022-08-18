import { Injectable, Logger } from '@nestjs/common';
import { SUPER_USER } from 'src/helpers/super_user';
import { AccountService } from 'src/resources/account/account.service';
import { CreateAccountDto } from 'src/resources/account/dto/create-account.dto';

@Injectable()
export class AppInitService {
  constructor(private readonly accountService: AccountService) {}

  public initialize() {
    Logger.log('App Initialiser');
    this.createSuperUser();
    Logger.log('App Initialiser complete');
  }

  private async createSuperUser(): Promise<void> {
    const exists = await this.accountService.findOneBy({
      userName: SUPER_USER.userName,
    });
    if (exists) return;
    await this.accountService.create({ ...SUPER_USER });
  }
}
