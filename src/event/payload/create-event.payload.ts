import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  Max,
  Min,
  IsDate,
  MinDate,
  MaxDate,
} from 'class-validator';

export class CreateEventPayload {
  @IsInt()
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
  @ApiProperty({
    description: 'category ID',
    type: Number,
  })
  categoryId!: number;

  @IsInt()
  @ApiProperty({
    description: 'city ID',
    type: Number,
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
  @MinDate(new Date())
  @MaxDate(new Date('2025-12-31'))
  @ApiProperty({
    description: 'end time',
    type: Date,
  })
  endTime!: Date;

  @IsInt()
  @Min(5)
  @Max(100)
  @ApiProperty({
    description: 'max people',
    type: Number,
  })
  maxPeople!: number;
}
