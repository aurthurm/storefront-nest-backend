import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import {
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';

@Injectable()
export class UserService {
  SALT_ROUNS = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    createUser.pin = await bcrypt.hash(createUser.pin, this.SALT_ROUNS);
    createUser.password = await bcrypt.hash(
      createUser.password,
      this.SALT_ROUNS,
    );
    return createUser.save();
  }

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    createUser.status = 'confirm';
    return createUser.save();
  }

  createBotAccount(source: string, pin: string, active: boolean) {
    const createUser = new this.userModel();
    createUser.waBotPhone = source;
    createUser.phone = source;
    createUser.email = `${source}@storefront`;
    createUser.pin = pin;
    createUser.status = 'active';
    createUser.botActive = active;
    return createUser.save();
  }

  updateBotAccount;

  async findAll(query = {}) {
    console.log(query);
    return await this.userModel.find(query).exec();
  }

  async filter(collectionDto: any): Promise<CollectionResponse<UserDocument>> {
    const collector = new DocumentCollector<UserDocument>(this.userModel);
    return collector.find(collectionDto);
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
