import { ApiProperty } from '@nestjs/swagger';
import { ClubDetailData } from '../type/club-detail-data.type';
import { ClubStatus } from '@prisma/client';

export class SimpleUserDto {
  @ApiProperty({
    description: 'User ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: 'User 이름',
    type: String,
  })
  name!: string;
}

export class ClubDetailDto {
  @ApiProperty({
    description: 'Club ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: 'Club name',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: 'Leader ID',
    type: Number,
  })
  leaderId!: number;

  @ApiProperty({
    description: 'Description',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: 'Max people',
    type: Number,
  })
  maxPeople!: number;

  @ApiProperty({
    description: 'Member',
    type: [SimpleUserDto],
  })
  members!: SimpleUserDto[];

  static from(data: ClubDetailData): ClubDetailDto {
    return {
      id: data.id,
      name: data.name,
      leaderId: data.leaderId,
      description: data.description,
      maxPeople: data.maxPeople,
      members: data.members.map((join) => ({
        id: join.user.id,
        name: join.user.name,
      })),
    };
  }
}
