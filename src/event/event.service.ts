import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { UserBaseInfo } from '../auth/type/user-base-info.type';
import { EventListDto, EventDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';
import { EventQuery } from './query/event.query';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventData } from './type/event-data.type';
import { EventJoin, User } from '@prisma/client';


@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {}

    async createEvent(payload: CreateEventPayload, user: UserBaseInfo): Promise<EventDto> {
        const category = await this.eventRepository.getCategoryById(
            payload.categoryId
        );
        if (!category) {
            throw new NotFoundException('Category를 찾을 수 없습니다.')
        }

        const city = await this.eventRepository.getCityById(
            payload.cityId
        );
        if (!city) {
            throw new NotFoundException('City를 찾을 수 없습니다.')
        }

        if (payload.startTime >= new Date()) {  
            throw new BadRequestException(
                '시작 시간은 종료 시간보다 빨라야 합니다.');
        }

        if (payload.startTime <= new Date()) {
            throw new BadRequestException(
                '모임 시작 시간은 현재 시간 이후여야 합니다.');
        }

        const createData: CreateEventData = {
            hostId: payload.hostId,
            title: payload.title,
            description: payload.description,
            categoryId: payload.categoryId,
            cityId: payload.cityId,
            startTime: payload.startTime,
            endTime: payload.endTime,
            maxPeople: payload.maxPeople,
        }

        const event = await this.eventRepository.createEvent(createData);

        return EventDto.from(event);
    }

    async getEventById(eventId: number): Promise<EventDto> {
        const event = await this.eventRepository.getEventById(eventId);

        if (!event) {
            throw new NotFoundException('Event가 존재하지 않습니다.');
        }

        return EventDto.from(event);
    }

    async getEvents(query: EventQuery): Promise<EventListDto> {
        const events = await this.eventRepository.getEvents(query);

        return EventListDto.from(events);
    }

    async joinEvent(eventId: number, user: UserBaseInfo): Promise<void> {
        const event = await this.eventRepository.getEventById(eventId);

        if (!event) {
            throw new NotFoundException('모임을 찾을 수 없습니다.');
        }

        if(event.startTime < new Date()) {
            throw new ConflictException('이미 시작된 모임에 참여할 수 없습니다.');
        }

        const participantsIds = await this.eventRepository.getParticipantsIds(eventId, user.id);

        if (participantsIds.includes(user.id)) {
            throw new ConflictException('이미 참여한 모임입니다.')
        }

        if (participantsIds.length >= event.maxPeople) {
            throw new ConflictException('인원이 가득 찼습니다')
        }

        await this.eventRepository.joinEvent(eventId, user.id);
    }

    async leaveEvent(eventId: number, user: UserBaseInfo): Promise<void> {
        const event = await this.eventRepository.getEventById(eventId);

        if (!event) {
            throw new NotFoundException('모임을 찾을 수 없습니다.');
        }

        if (event.hostId === user.id) { 
            throw new ConflictException('모임 주최자는 모임에서 나갈 수 없습니다.')
        }

        if (event.startTime < new Date()) {
            throw new ConflictException('이미 시작된 모임에서 나갈 수 없습니다.')
        }

        const participantsIds = await this.eventRepository.getParticipantsIds(eventId, user.id);

        if (!participantsIds.includes(user.id)) {
            throw new ConflictException('참여하지 않은 모임입니다.')
        }

        await this.eventRepository.leaveEvent(eventId, user.id);
    }
}
