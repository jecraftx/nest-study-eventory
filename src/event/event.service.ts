import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventListDto, EventDto } from './dto/event.dto';
import { EventData } from './type/event-data.type';
import { EventQuery } from './query/event.query';

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
