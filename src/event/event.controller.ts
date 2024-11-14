import { Controller, Get, ParseIntPipe, Query, Param, Body} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { Event} from '@prisma/client';
import { EventListDto, EventDto } from './dto/event.dto';
import { CategoryListDto } from 'src/category/dto/category.dto';
import { EventQuery } from './query/event.query';

@Controller('event')
@ApiTags('Event API')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    // @Get()  
    // @ApiOperation({ summary: 'all events list'})
    // @ApiOkResponse({ type: EventListDto })
    // async findAllevents(): Promise<EventListDto> {
    //     return this.eventService.findAllEvents();
    // }

    @Get()  
    @ApiOperation({ summary: '여러 야벤트 정보를 가져옵니다'})
    @ApiOkResponse({ type: EventListDto })
    async getEvents(@Query() query: EventQuery): Promise<EventListDto> {
        return this.eventService.getEvents(query);
    }
}
