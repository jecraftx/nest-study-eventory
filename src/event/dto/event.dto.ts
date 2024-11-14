import { ApiProperty } from "@nestjs/swagger";
import { EventData } from "../type/event-data.type";

export class EventDto {
    @ApiProperty({
        description: 'event ID',
        type: Number,
    })
    id!: number;

    @ApiProperty({
        description: 'host ID',
        type: Number,
    })
    hostID!: number;

    @ApiProperty({
        description: 'event title',
        type: String,
    })
    title!: string;

    @ApiProperty({
        description: 'event description',
        type: String,
    })
    decription!: string;

    @ApiProperty({
        description: 'category ID',
        type: Number,
    })
    categoryID!: number;

    @ApiProperty({
        description: 'city ID',
        type: Number,
    })
    cityID!: number;

    @ApiProperty({
        description: 'start time',
        type: Date,
    })
    startTime!: Date;

    @ApiProperty({
        description: 'end time',
        type: Date,
    })
    endTime!: Date;

    @ApiProperty({
        description: 'max people',
        type: Number,
    })
    maxPeople!: number;



    static from(event: EventData): EventDto {
        return {
            id: event.id,
            hostID: event.hostId,
            title: event.title,
            decription: event.description,
            categoryID: event.categoryId,
            cityID: event.cityId,
            startTime: event.startTime,
            endTime: event.endTime,
            maxPeople: event.maxPeople
        };
    }

    static fromArray(events: EventData[]): EventDto[] {
        return events.map((event) => this.from(event));
    }
}

export class EventListDto {
    @ApiProperty({
        description: 'event desc',
        type: [EventDto]
    })
    events!: EventDto[];

    static from(events: EventData[]): EventListDto {
        return {
            events: EventDto.fromArray(events),
        };
    }
}