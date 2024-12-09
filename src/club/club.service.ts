import { Injectable, ConflictException, NotFoundException, ForbiddenException} from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { ClubDto, ClubListDto} from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CreateClubData } from './type/create-club-data.type';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { ClubJoin } from '@prisma/client';

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

        await this.clubRepository.joinClub(clubId, user.id);
    }
    
    async leaveClub(clubId: number, user: UserBaseInfo): Promise<void> {
        const club = await this.clubRepository.getClubById(clubId);

        if (!club) {
            throw new NotFoundException('Can not find a club.');
        }

        // Ensure leader cannot leave the club
        if (club.leaderId === user.id) {
            throw new ConflictException('Leader of the Club cannot leave.');
        }

        // Get all events related to the club
        const events = await this.clubRepository.getClubEvents(clubId);

        // Loop through the events and handle the user as host or participant
        for (const event of events) {
            // If the event has already started, we archive it
            if (event.startTime < new Date()) {
            // Archive the event (mark it as archived in the database)
                await this.clubRepository.archiveEvent(event.id);
            } else {
            // If the event has not started:
            // If the user is the host, we delete the event
                if (event.hostId === user.id) {
                    await this.clubRepository.deleteEvent(event.id);
                } else {
                    // If the user is a participant, we remove them from the event
                    await this.clubRepository.removeParticipantFromEvent(event.id, user.id);
                }
            }
        }
        // Remove the user from the club
        await this.clubRepository.leaveClub(clubId, user.id);
    }
}


