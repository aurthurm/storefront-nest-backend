import { ApiProperty } from '@nestjs/swagger';

export class CreateBotDto {
  @ApiProperty()
  source: string;

  @ApiProperty()
  previousMenu: string;

  @ApiProperty()
  currentMenu: string;

  @ApiProperty()
  nextMenu: string;

  @ApiProperty()
  responses: any;

  @ApiProperty({ enum: ['pending', 'closed'] })
  status: string;

  @ApiProperty({
    default: true,
  })
  menuLock: boolean;
}
