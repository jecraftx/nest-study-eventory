import { Injectable, ConflictException, NotFoundException, ForbiddenException} from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { ClubDto, ClubListDto} from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CreateClubData } from './type/create-club-data.type';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { ClubJoin, ClubStatus } from '@prisma/client';
import { Event } from '@prisma/client';
@Injectable()
export class ClubService {
    constructor(private readonly clubRepository: ClubRepository) {}
        
    async createClub(payload: CreateClubPayload, user: UserBaseInfo): Promise<ClubDto> {
        const isNameExist = await this.clubRepository.isNameExist(
            payload.name,
        );
        if (isNameExist) {
            throw new ConflictException('이미 동일한 이름의 클럽이 존재합니다. 다른 이름으로 클럽을 생성해주세요.');
        }

        const createData: CreateClubData = {
            name: payload.name,
            leaderId: user.id,
            description: payload.description,
            maxPeople: payload.maxPeople,
        };

        const club = await this.clubRepository.createClub(createData)

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
            throw new NotFoundException('모임을 찾을 수 없습니다.');
        }

        const membersIds = await this.clubRepository.getMembersIds(clubId);

        if (membersIds.includes(user.id)) {
            throw new ConflictException('You are already a member.');
        }

        if (membersIds.length >= club.maxPeople) {
            throw new ConflictException('Club is already full.');
        }

        if (ClubStatus.PENDING) {
            throw new ForbiddenException('Your status is not approved yet.')
        }

        if (ClubStatus.REJECTED) {
            throw new ForbiddenException('You are not allowed to join this club.')
        }

        await this.clubRepository.joinClub(clubId, user.id);
    }
    
    async leaveClub(clubId: number, user: UserBaseInfo): Promise<void> {
        const club = await this.clubRepository.getClubById(clubId);

        if (!club) {
            throw new NotFoundException('Can not find a club.');
        }

        if (club.leaderId === user.id) {
            throw new ConflictException('Leader of the Club cannot leave.');
        }

        const membersIds =
        await this.clubRepository.getMembersIds(clubId);

        if (!membersIds.includes(user.id)) {
            throw new ConflictException('You are not the member of the club.');
        }

        await this.clubRepository.leaveClub(clubId, user.id);
    }
}


