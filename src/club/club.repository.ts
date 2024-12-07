import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ClubData } from './type/club-data.type';
import { User, Club } from '@prisma/client';
import { CreateClubData } from './type/create-club-data.type';

@Injectable()
export class ClubRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClub(data: CreateClubData): Promise<ClubData> {
    return this.prisma.club.create({
      data: {
        name: data.name,
        description: data.description,
        leaderId: data.leaderId,
        maxPeople: data.maxPeople,
      },
    });
  }

  async isNameExist(clubName: string): Promise<boolean> {
    const club = await this.prisma.club.findUnique({
      where: {
        name: clubName,
      },
    });

    return !!club;
  }
}
