import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './createEvent.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  async createNewEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return await this.eventsRepository.save(event);
  }

  async getEventById(eventId: number): Promise<Event> {
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException({ error: 'Invalid event ID!' });
    }

    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({ error: 'Event not found!' });
    }
    return event;
  }

  async deleteEventById(eventId: number): Promise<{ success: boolean }> {
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException({ error: 'Invalid event ID!' });
    }

    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({ error: 'Event not found!' });
    }

    await this.eventsRepository.delete(eventId);
    return { success: true };
  }
}
