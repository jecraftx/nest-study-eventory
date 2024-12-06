import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateClubPayload {
  @IsString()
  @ApiProperty({
    description: 'Name',
    type: String,
  })
  name!: string;

  @IsString()
  @ApiProperty({
    description: 'Description',
    type: String,
  })
  description!: string;

  @Min(2)
  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Max People',
    type: Number,
  })
  maxPeople!: number;
}
