import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { Lease, LeaseDocument } from './entities/lease.entity';

@Injectable()
export class LeaseService {
  constructor(
    @InjectModel(Lease.name)
    private leaseModel: Model<LeaseDocument>,
  ) {}

  async create(createLeaseDto: CreateLeaseDto) {
    return await this.leaseModel.create(createLeaseDto);
  }

  async findAll(query = {}) {
    return await this.leaseModel.find(query);
  }

  async findOne(id: string) {
    return await this.leaseModel.findById(id);
  }

  async update(id: string, updateLeaseDto: UpdateLeaseDto) {
    return await this.leaseModel.findByIdAndUpdate(id, updateLeaseDto);
  }

  async remove(id: string) {
    return await this.leaseModel.remove(id);
  }
}
