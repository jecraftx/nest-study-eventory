import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  Max,
  Min,
  IsDate,
  MinDate,
  MaxDate,
  IsPositive,
  IsArray,
} from 'class-validator';

export class CreateEventPayload {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'host ID',
    type: Number,
  })
  hostId!: number;

  @IsString()
  @ApiProperty({
    description: 'event title',
    type: String,
  })
  title!: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'event description',
    type: String,
  })
  description!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'category ID',
    type: Number,
  })
  categoryId!: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'city ID',
    type: [Number],
  })
  cityId!: number;

  @IsDate()
  @MinDate(new Date())
  @ApiProperty({
    description: 'start time',
    type: Date,
  })
  startTime!: Date;

  @IsDate()
  @ApiProperty({
    description: 'end time',
    type: Date,
  })
  endTime!: Date;

  @IsInt()
  @Min(2)
  @ApiProperty({
    description: 'max people',
    type: Number,
  })
  maxPeople!: number;
}
