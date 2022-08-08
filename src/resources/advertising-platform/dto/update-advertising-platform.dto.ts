import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertisingPlatformDto } from './create-advertising-platform.dto';

export class UpdateAdvertisingPlatformDto extends PartialType(CreateAdvertisingPlatformDto) {}
