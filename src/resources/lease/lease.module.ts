import { Module } from '@nestjs/common';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lease, LeaseSchema } from './entities/lease.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lease.name, schema: LeaseSchema }]),
  ],
  controllers: [LeaseController],
  providers: [LeaseService],
})
export class LeaseModule {}
