import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class LeadershipTransferPayload {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: 'New LeaderID',
    type: Number,
  })
  newLeaderId!: number;
}
