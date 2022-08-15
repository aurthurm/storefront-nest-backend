import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant, TenantDocument } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    return await this.tenantModel.create(createTenantDto);
  }

  async findAll(query = {}) {
    return await this.tenantModel.find(query);
  }

  async findOne(id: string) {
    return await this.tenantModel.findById(id);
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    return await this.tenantModel.findByIdAndUpdate(id, updateTenantDto);
  }

  async remove(id: string) {
    return await this.tenantModel.remove(id);
  }
}
