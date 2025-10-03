import { Controller, Get, Param, UseInterceptors, Delete, UseGuards, Post, Body } from '@nestjs/common';
import { Event } from './event.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomParseIntPipe } from 'src/common/pipes/customParseIntPipe/CustomParseIntPipe';
import { EventsService } from './events.service';
import { CreateEventDto } from './createEvent.dto';

@Controller('events')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return await this.eventsService.getAllEvents();
  }

  @Post()
  async createNewEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventsService.createNewEvent(createEventDto);
  }

  @Get(':eventId')
  async getEventById(@Param('eventId', new CustomParseIntPipe('Event ID')) eventId: number): Promise<Event> {
    return await this.eventsService.getEventById(eventId);
  }

  @Delete(':eventId')
  async deleteEventById(@Param('eventId', new CustomParseIntPipe('Event ID')) eventId: number): Promise<{ success: boolean }> {
    return await this.eventsService.deleteEventById(eventId);
  }
}
