import {
  Controller,
  Get,
  Post,
  ParseIntPipe,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { Event } from '@prisma/client';
import { EventListDto, EventDto } from './dto/event.dto';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventQuery } from './query/event.query';

@Controller('event')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':eventId')
  @ApiOperation({ summary: '이벤트 상세 정보를 가져옵니다' })
  @ApiOkResponse({ type: EventDto })
  async getEventById(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<EventDto> {
    return this.eventService.getEventById(eventId);
  }

  @Get()
  @ApiOperation({ summary: '여러 야벤트 정보를 가져옵니다' })
  @ApiOkResponse({ type: EventListDto })
  async getEvents(@Query() query: EventQuery): Promise<EventListDto> {
    return this.eventService.getEvents(query);
  }
}
