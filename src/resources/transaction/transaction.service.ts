import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionDocument,
} from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionModel.create(createTransactionDto);
  }

  async findAll(query = {}) {
    return await this.transactionModel.find(query);
  }

  async findOne(id: string) {
    return await this.transactionModel.findById(id);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return await this.transactionModel.findByIdAndUpdate(
      id,
      updateTransactionDto,
    );
  }

  async remove(id: string) {
    return await this.transactionModel.remove(id);
  }
}
