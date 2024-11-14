import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { EventData } from "./type/event-data.type";
import { EventQuery } from "./query/event.query";
import { User, Category, City } from '@prisma/client';

@Injectable() 
export class EventRepository {
    constructor(private readonly prisma: PrismaService) {}

    // async findAllEvents(): Promise<EventData[]> {
    //     return this.prisma.event.findMany({
    //         select: {
    //             id: true,
    //             hostId: true,
    //             title: true,
    //             description: true,
    //             categoryId: true,
    //             cityId: true,
    //             startTime: true,
    //             endTime: true,
    //             maxPeople: true,
    //           },
    //     });

    // host category city IDs
    async getEvents(query: EventQuery): Promise<EventData[]> {
        return this.prisma.event.findMany({
            where: {
                hostId: query.hostId,
                categoryId: query.categoryId,
                cityId: query.cityId,
            },
            select: {
                id: true,
                hostId: true,
                title: true,
                description: true,
                categoryId: true,
                cityId: true,
                startTime: true,
                endTime: true,
                maxPeople: true,
              },
        });
    }
}

