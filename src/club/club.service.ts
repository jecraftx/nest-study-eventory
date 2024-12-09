import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CreateClubData } from './type/create-club-data.type';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { ClubJoin, ClubStatus } from '@prisma/client';
import { Event } from '@prisma/client';
import { EventJoin } from '@prisma/client';

@Injectable()
export class ClubService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async createClub(
    payload: CreateClubPayload,
    user: UserBaseInfo,
  ): Promise<ClubDto> {
    const isNameExist = await this.clubRepository.isNameExist(payload.name);
    if (isNameExist) {
      throw new ConflictException(
        '이미 동일한 이름의 클럽이 존재합니다. 다른 이름으로 클럽을 생성해주세요.',
      );
    }

    const createData: CreateClubData = {
      name: payload.name,
      leaderId: user.id,
      description: payload.description,
      maxPeople: payload.maxPeople,
    };

    const club = await this.clubRepository.createClub(createData);

    return ClubDto.from(club);
  }

  async getClubById(clubId: number): Promise<ClubDetailDto> {
    const club = await this.clubRepository.findClubDetailById(clubId);

    if (!club) {
      throw new NotFoundException('Can not find the Club.');
    }

    return ClubDetailDto.from(club);
  }

  async getClubs(query: ClubQuery): Promise<ClubListDto> {
    const clubs = await this.clubRepository.getClubs(query);

    return ClubListDto.from(clubs);
  }

  async joinClub(clubId: number, user: UserBaseInfo): Promise<void> {
    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('Can not find a club.');
    }

    const membersIds = await this.clubRepository.getMembersIds(clubId);

    if (membersIds.includes(user.id)) {
      throw new ConflictException('You are already a member.');
    }

    if (membersIds.length >= club.maxPeople) {
      throw new ConflictException('Club is already full.');
    }

    // 상태가 APPROVED가 아닐 때의 경우 처리
    if (ClubStatus.APPROVED) {
      throw new ForbiddenException('Your status is not approved yet.');
    }
    if (ClubStatus.REJECTED) {
      throw new ForbiddenException('You are not allowed to join this club.');
    }

    await this.clubRepository.joinClub(clubId, user.id);
  }

  async leaveClub(clubId: number, user: UserBaseInfo): Promise<void> {
    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('Cannot find the club.');
    }

    if (club.leaderId === user.id) {
      throw new ConflictException('Leader of the Club cannot leave.');
    }

    const membersIds = await this.clubRepository.getMembersIds(clubId);

    if (!membersIds.includes(user.id)) {
      throw new ConflictException('You are not a member of the club.');
    }

    const events = await this.clubRepository.getClubEvents(clubId);

    for (const event of events) {
      const now = new Date();

      if (event.endTime <= now) {
        // 이미 완료된 이벤트: 변경 사항 필요 없음
        continue;
      } else if (event.startTime > now && event.hostId === user.id) {
        // 사용자가 호스트인 경우 다가오는 이벤트 삭제
        await this.clubRepository.deleteEvent(event.id);
      } else if (event.startTime > now) {
        // 사용자가 참가자인 경우 다가오는 이벤트에서 제거
        await this.clubRepository.removeParticipantFromEvent(event.id, user.id);
      }
    }

    await this.clubRepository.leaveClub(clubId, user.id);
  }
}
