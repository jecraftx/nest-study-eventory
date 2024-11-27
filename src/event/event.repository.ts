import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CreateEventData } from "./type/create-event-data.type";
import { EventData } from "./type/event-data.type";
import { EventQuery } from "./query/event.query";
import { User, Category, City } from '@prisma/client';

@Injectable() 
export class EventRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createEvent(data: CreateEventData): Promise<EventData> {
        return this.prisma.event.create({
            data: {
                hostId: data.hostId,
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                cityId: data.cityId,
                startTime: data.startTime,
                endTime: data.endTime,
                maxPeople: data.maxPeople,
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

    // need the user to compare with the host id 
    async getUserById(userId: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    // needed by default, if not event then no users, nothing
    async isEventExist(eventId: number): Promise<boolean> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });
        return !!event;
    }

    // if user joined the event
    // however user can not join the event if it already started 
    async isUserJoinedEvent(eventId: number, userId: number): Promise<boolean> {
        const eventJoin = await this.prisma.eventJoin.findUnique({
            where: { eventId_userId: { eventId, userId } },
        });
        return !!eventJoin;
    }

    // if host then can delete and edit the events before they start
    async isHost(eventId: number, userId: number): Promise<boolean> {
        const event = await this.prisma.event.findFirst({
            where: {
                id: eventId,
                hostId: userId,
            },
        });
        return !!event;
    }

    async getEventById(eventId: number): Promise<EventData | null> {
        return this.prisma.event.findUnique({
            where: {
                id: eventId,
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

