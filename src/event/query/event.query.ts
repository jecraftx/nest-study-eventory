import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// host, category, city IDs
export class EventQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'host ID',
    type: Number,
  })
  hostId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'category ID',
    type: Number,
  })
  categoryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'city ID',
    type: Number,
  })
  cityId?: number;
}
