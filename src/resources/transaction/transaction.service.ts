import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { PaynowService } from 'src/providers/paynow/paynow/paynow.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionDocument,
} from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private paynowService: PaynowService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const created = await this.transactionModel.create(createTransactionDto);
    const payment = this.paynowService.createPayment();
    const sentToWeb = await this.paynowService.sendToWeb(payment);
    created.paynowResponse = sentToWeb;
    this.paynowService.pollUrl(created.paynowResponse?.pollUrl).subscribe({
      next: (response) => {
        created.pollResults = this.paynowService.decodeUrlParams(response.data);
        created.save();
      },
    });
    return (
      created.paynowResponse?.redirectUrl ?? created.paynowResponse.success
    );
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

  @Cron('5 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
