import { Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import { ClubRepository } from './club.repository';
import { ClubDto } from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CreateClubData } from './type/create-club-data.type';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';

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
}

