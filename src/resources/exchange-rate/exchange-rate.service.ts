import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import {
  ExchangeRate,
  ExchangeRateDocument,
} from './entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectModel(ExchangeRate.name)
    private exchangeRateModel: Model<ExchangeRateDocument>,
  ) {}

  async create(createExchangeRateDto: CreateExchangeRateDto) {
    return await this.exchangeRateModel.create(createExchangeRateDto);
  }

  async findAll(query = {}) {
    return await this.exchangeRateModel.find(query);
  }

  async findOne(id: string) {
    return await this.exchangeRateModel.findById(id);
  }

  async update(id: string, updateExchangeRateDto: UpdateExchangeRateDto) {
    return await this.exchangeRateModel.findByIdAndUpdate(
      id,
      updateExchangeRateDto,
    );
  }

  async remove(id: string) {
    return await this.exchangeRateModel.remove(id);
  }
}
