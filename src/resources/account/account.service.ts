import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './entities/account.entity';

@Injectable()
export class AccountService {
  SALT_ROUNS = 10;

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const createAccount = new this.accountModel(createAccountDto);
    createAccount.pin = await bcrypt.hash(createAccount.pin, this.SALT_ROUNS);
    createAccount.password = await bcrypt.hash(
      createAccount.password,
      this.SALT_ROUNS,
    );
    return createAccount.save();
  }

  createBotAccount(source: string, pin: string, active: boolean) {
    const createAccount = new this.accountModel();
    createAccount.waBotPhone = source;
    createAccount.phone = source;
    createAccount.email = `${source}@storefront`;
    createAccount.pin = pin;
    createAccount.botActive = active;
    return createAccount.save();
  }

  async findAll(query = {}) {
    console.log(query);
    return await this.accountModel.find(query).exec();
  }

  async findOne(id: string) {
    return await this.accountModel.findById(id).lean();
  }

  async findByEmailOrPhone(payload: string) {
    return await this.accountModel
      .findOne({
        $or: [{ phone: payload }, { email: payload }],
      })
      .lean();
  }

  async getAccountBySource(source: string) {
    return await this.accountModel
      .findOne({
        waBotPhone: source,
      })
      .lean();
  }

  async findByResetKey(resetKey: string) {
    return await this.accountModel
      .findOne({
        $or: [{ resetPasswordKey: resetKey }, { resetPinKey: resetKey }],
      })
      .lean();
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel
      .findByIdAndUpdate(id, updateAccountDto)
      .setOptions({ new: true })
      .exec();
  }

  remove(id: string) {
    return this.accountModel.findByIdAndDelete(id);
  }
}
