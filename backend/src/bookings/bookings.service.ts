import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './createBooking.dto';
import { Booking } from './booking.entity';
import { ReqUser } from 'src/interfaces/ReqUser';
import { Event } from 'src/events/event.entity';
import { UserRole } from 'src/userRoles/userRole.entity';
import { UserRoles } from 'src/userRoles/userRoles.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,

    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingsRepository.find();
  }

  async createNewBooking(createBookingDto: CreateBookingDto, reqUser: ReqUser): Promise<Booking> {
    const { eventId } = createBookingDto;

    const event = await this.eventsRepository.findOne({ where: { id: eventId }, relations: ['bookings'] });
    if (!event) {
      throw new BadRequestException({ error: 'Event not found!' });
    }

    const existingBooking = await this.bookingsRepository.findOne({ where: { eventId, userId: reqUser.id } });
    if (existingBooking) {
      throw new BadRequestException({ error: 'User already booked this event!' });
    }

    const bookedSeats = event.bookings.length;
    if (bookedSeats >= event.totalSeats) {
      throw new BadRequestException({ error: 'No seats available!' });
    }

    const booking = this.bookingsRepository.create({ eventId, userId: reqUser.id });
    return await this.bookingsRepository.save(booking);
  }

  async getBookingById(bookingId: number): Promise<Booking> {
    if (!bookingId || isNaN(bookingId)) {
      throw new BadRequestException({ error: 'Invalid booking ID!' });
    }

    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException({ error: 'Booking not found!' });
    }
    return booking;
  }

  async deleteBookingById(bookingId: number, reqUser: ReqUser): Promise<{ success: boolean }> {
    if (!bookingId || isNaN(bookingId)) {
      throw new BadRequestException({ error: 'Invalid booking ID!' });
    }

    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId }, relations: ['user'] });
    if (!booking) {
      throw new NotFoundException({ error: 'Booking not found!' });
    }

    const reqUserRole = await this.userRolesRepository.findOne({ where: { id: reqUser.roleId } });
    const isAdmin = reqUserRole?.name === UserRoles.ADMIN;
    const isOwner = booking.user.id === reqUser.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission to delete this booking!' });
    }

    await this.bookingsRepository.delete(bookingId);
    return { success: true };
  }
}
