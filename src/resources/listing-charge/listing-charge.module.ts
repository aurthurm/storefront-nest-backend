import { Module } from '@nestjs/common';
import { ListingChargeService } from './listing-charge.service';
import { ListingChargeController } from './listing-charge.controller';

@Module({
  controllers: [ListingChargeController],
  providers: [ListingChargeService]
})
export class ListingChargeModule {}
