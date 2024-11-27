import { Injectable, NotFoundException, ConflictException, BadRequestException} from '@nestjs/common';
import { EventRepository } from './event.repository';
import {UserBaseInfo} from '../auth/type/user-base-info.type';
import { EventListDto, EventDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';
import { EventQuery } from './query/event.query';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventData } from './type/event-data.type';
import { EventJoin } from '@prisma/client';


// # API for creating events

// # - Users can create events and become the host.
// # - Events include title, description, host, category, location, times, and capacity.
// # - Events have three statuses: Before Start, Ongoing, Ended.
// # - Only the host can modify/delete events before they start.
// # - Joining/leaving is allowed only before the event starts.

// # API:
// # - Method: POST
// # - URL: /events
// # - Request: Event details (host, title, category, etc.)
// # - Response: Created event data with ID.

// # Tip: Host is automatically added as a participant.


@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {}

    async createEvent(payload: CreateEventPayload): Promise<EventDto> {
        const isEventExist = await this.eventRepository.isEventExist(
            payload.hostId
        );

        if (isEventExist) {
            throw new ConflictException('Event가 이미 존재합니다.');
        }

        if (payload.startTime <= new Date()) {  
            throw new ConflictException(
                'Event가 이미 시작되었습니다. 수정하거나 삭제할 수 없습니다.');
        }

        if (payload.startTime >= payload.endTime) {
            throw new ConflictException(
                '시작 시간은 종료 시간보다 이전이어야 합니다.');
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

    async joinEvent(eventId: number): Promise<void> {
        const event = await this.eventRepository.findEventById(eventId);

        if(event.hostId === user.id) { 
            throw new ConflictException('Host can not leave the Event.')
        }

        if(event.startTime < new Date()) {
            throw new ConflictException('Cannot join an event that has already started.');
        }

        const participantsIds = await this.eventRepository.getParticipantsIds(eventId);

        if (participantsIds.includes(user.id)) {
            throw new ConflictException('You are already a participant of this event.')
        }

        if (participantsIds.length >= event.maxPeople) {
            throw new ConflictException('Event is already full.')
        }

        await this.eventRepository.isUserJoinedEvent(eventId, user.id);
        
    }

    async leaveEvent(eventId: number): Promise<void> {
        const event = this.eventRepository.findEventById(eventId);
        if (!event) {
            throw new NotFoundException('Can not find the Event.');
        }

        if(event.hostId === user.id) { 
            throw new ConflictException('Host can not leave the Event.')
        }

        if (event.startTime < new Date()) {
            throw new ConflictException('Cannot leave an event that has already started.')
        }

        const participantsIds = await this.eventRepository.getParticipantsIds(eventId);

        if (!participantsIds.includes(user.id)) {
            throw new ConflictException('You are not a participant of this event.')
        }

        await this.eventRepository.leaveEvent(eventId, user.id);
    }


}
