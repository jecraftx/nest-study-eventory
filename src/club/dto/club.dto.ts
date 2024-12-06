import { ApiProperty } from '@nestjs/swagger';
import { ClubData } from '../type/club-data.type';

export class ClubDto {
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
    description: 'Description',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: 'Leader ID',
    type: Number,
  })
  leaderId!: number;

  @ApiProperty({
    description: 'Max People',
    type: Number,
  })
  maxPeople!: number;

  static from(club: ClubData): ClubDto {
    return {
      id: club.id,
      name: club.name,
      description: club.description ?? '',
      leaderId: club.leaderId,
      maxPeople: club.maxPeople,
    };
  }

  static fromArray(clubs: ClubData[]): ClubDto[] {
    return clubs.map((club) => this.from(club));
  }
}

export class ClubListDto {
  @ApiProperty({
    description: 'Club Description',
    type: [ClubDto],
  })
  clubs!: ClubDto[];

  static from(clubs: ClubData[]): ClubListDto {
    return {
      clubs: ClubDto.fromArray(clubs),
    };
  }
}
