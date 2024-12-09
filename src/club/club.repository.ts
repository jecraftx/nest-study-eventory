import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ClubData } from './type/club-data.type';
import { User, Club } from '@prisma/client'
import { CreateClubData } from './type/create-club-data.type';
import { ClubDetailData } from './type/club-detail-data.type';
import { ClubQuery } from './query/club.query';
import { ClubJoin } from '@prisma/client';
import { ClubStatus } from '@prisma/client';

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
          members: {
            create: {
              userId: data.leaderId,
              status: ClubStatus.PENDING,
            },
          },
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

    async getClubById(id: number): Promise<ClubData | null> {
      return this.prisma.club.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          leaderId: true,
          description: true,
          maxPeople: true,
        },
      });
    }

    async getClubs(query: ClubQuery): Promise<ClubData[]> {
      return this.prisma.club.findMany({
        where: {
          name: query.name,
          leader: {
            id: query.leaderId,
            deletedAt: null
          },
        },
        select: {
          id: true,
          name: true,
          leaderId: true,
          description: true,
          maxPeople: true,
        },
      });
    }

    async findClubDetailById(clubId: number): Promise<ClubDetailData | null> {
      return this.prisma.club.findUnique({
        where: {
          id: clubId,
        },
        select: {
          id: true,
          name: true,
          leaderId: true,
          description: true,
          maxPeople: true,
          createdAt: true,
          updatedAt: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    // 승인된 사람들만 멤버로 간주됩니다.
    async getMembersIds(clubId: number): Promise<number[]> {
      const data = await this.prisma.clubJoin.findMany({
        where: {
          clubId,
          user: {
            deletedAt: null,
          },
          status: 'APPROVED',
        },
        select: {
          userId: true,
        },
      });
      return data.map((d) => d.userId);
    }

    async joinClub(clubId: number, userId: number): Promise<void> {
      await this.prisma.clubJoin.create({
        data: {
          clubId,
          userId,
        },
      });
    }

    async leaveClub(clubId: number, userId: number): Promise<void> {
      await this.prisma.clubJoin.delete({
        where: {
          clubId_userId: {
            clubId,
            userId,
          },
        },
      });
    }

    async getClubEvents(clubId: number): Promise<Event[]> {
      return this.prisma.event.findMany({
        where: {
          clubId,
          deletedAt: null,
        },
      });
}
    // Archive an event (mark as completed)
    async archiveEvent(eventId: number): Promise<void> {
      await this.prisma.event.update({
        where: { id: eventId },
        data: { archived: true },
      });
    }

    // Delete an event (if not started)
    async deleteEvent(eventId: number): Promise<void> {
      await this.prisma.event.delete({
        where: { id: eventId },
      });
    }

    // Remove a participant from an event (if they are not the host)
    async removeParticipantFromEvent(eventId: number, userId: number): Promise<void> {
      await this.prisma.eventJoin.delete({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
      });
    }
  }
