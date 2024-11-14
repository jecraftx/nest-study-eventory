import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventListDto, EventDto } from './dto/event.dto';
import { EventData } from './type/event-data.type';
import { EventQuery } from './query/event.query';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {}

    // async findAllEvents():  Promise<EventListDto> {
    //     const events: EventData[] = await this.eventRepository.findAllEvents();

    //     return EventListDto.from(events);
    // }

    async getEvents(query: EventQuery): Promise<EventListDto> {
        const events = await this.eventRepository.getEvents(query);

        return EventListDto.from(events);
    }
}
