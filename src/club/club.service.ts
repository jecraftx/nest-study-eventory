import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CreateClubData } from './type/create-club-data.type';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { PutUpdateClubPayload } from './payload/put-update-club.payload';
import { PatchUpdateClubPayload } from './payload/patch-update-club';
import { UpdateClubData } from './type/update-club-data.type';

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

  async putUpdateClub(
    clubId: number,
    payload: PutUpdateClubPayload,
    user: UserBaseInfo,
  ): Promise<ClubDto> {
    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('Can not find a Club');
    }

    if (club.leaderId !== user.id) {
      throw new ForbiddenException('Only leader can edit.');
    }

    const isNameExist = await this.clubRepository.isNameExist(payload.name);
    if (isNameExist) {
      throw new ConflictException('Such name already exists.');
    }

    const data: UpdateClubData = {
      name: payload.name,
      description: payload.description,
      maxPeople: payload.maxPeople,
    };

    const membersIds = await this.clubRepository.getMembersIds;

    if (payload.maxPeople && membersIds.length > payload.maxPeople) {
      throw new ConflictException(
        'You cannot change the number of members to a number less than the current number.',
      );
    }

    const updatedClub = await this.clubRepository.updateClub(clubId, data);

    return ClubDto.from(updatedClub);
  }

  async patchUpdateClub(
    clubId: number,
    payload: PatchUpdateClubPayload,
    user: UserBaseInfo,
  ): Promise<ClubDto> {
    const data = this.validateNullOf(payload);

    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('Can not find a club.');
    }

    if (club.leaderId !== user.id) {
      throw new ForbiddenException('Only leader can edit.');
    }

    const isNameExist = await this.clubRepository.isNameExist(payload.name);

    if (isNameExist) {
      throw new ConflictException('Such name already exists.');
    }

    const membersIds = await this.clubRepository.getMembersIds;

    if (payload.maxPeople && membersIds.length > payload.maxPeople) {
      throw new ConflictException(
        'You cannot change the number of members to a number less than the current number.',
      );
    }

    const updatedClub = await this.clubRepository.updateClub(clubId, data);

    return ClubDto.from(updatedClub);
  }

  async deleteClub(clubId: number, user: UserBaseInfo): Promise<void> {
        const club = await this.clubRepository.getClubById(clubId);

        if (!club) {
            throw new NotFoundException('Can not find a club.');
        }

        if (club.leaderId !== user.id) {
            throw new ForbiddenException('Users can not delete the club.');
        }

        await this.clubRepository.deleteClub(clubId);
    }

  private validateNullOf(payload: PatchUpdateClubPayload): UpdateClubData {
    if (payload.name === null) {
      throw new BadRequestException('name can not be null');
    }

    if (payload.description === null) {
      throw new BadRequestException('description can not be null');
    }

    if (payload.maxPeople === null) {
      throw new BadRequestException('maxPeople can not be null');
    }

    return {
      name: payload.name,
      description: payload.description,
      maxPeople: payload.maxPeople,
    };
  }
}
