import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventListDto, EventDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';
import { EventQuery } from './query/event.query';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventData } from './type/event-data.type';
import { EventJoin } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

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
}
