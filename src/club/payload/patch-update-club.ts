import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PatchUpdateClubPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Club name',
    type: String,
  })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Club Description',
    type: String,
  })
  description?: string | null;

  @IsOptional()
  @Min(2)
  @IsInt()
  @ApiPropertyOptional({
    description: 'Max People',
    type: Number,
  })
  maxPeople?: number | null;
}
