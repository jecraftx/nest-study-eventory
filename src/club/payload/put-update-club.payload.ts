import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PutUpdateClubPayload {
  @IsString()
  @ApiProperty({
    description: 'Club Name',
    type: String,
  })
  name!: string;

  @IsString()
  @ApiProperty({
    description: 'Club Description',
    type: String,
  })
  description!: string;

  @Min(2)
  @IsInt()
  @ApiProperty({
    description: 'Max People',
    type: Number,
  })
  maxPeople!: number;
}
