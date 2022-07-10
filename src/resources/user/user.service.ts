import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  SALT_ROUNS = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    createUser.pin = await bcrypt.hash(createUser.pin, this.SALT_ROUNS);
    createUser.password = await bcrypt.hash(
      createUser.password,
      this.SALT_ROUNS,
    );
    return createUser.save();
  }

  createBotAccount(source: string) {
    const createUser = new this.userModel();
    createUser.waBotPhone = source;
    return createUser.save();
  }

  async findAll(query = {}) {
    console.log(query);
    return await this.userModel.find(query).exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).lean();
  }

  async findByEmailOrPhone(payload: string) {
    return await this.userModel
      .findOne({
        $or: [{ phone: payload }, { email: payload }],
      })
      .lean();
  }

  async getUserBySource(source: string) {
    return await this.userModel
      .findOne({
        waBotPhone: source,
      })
      .lean();
  }

  async findByResetKey(resetKey: string) {
    return await this.userModel
      .findOne({
        $or: [{ resetPasswordKey: resetKey }, { resetPinKey: resetKey }],
      })
      .lean();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .setOptions({ new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
