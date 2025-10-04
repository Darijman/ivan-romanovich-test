import { Controller, Get, Param, UseInterceptors, Delete, UseGuards, Post, Body, Req } from '@nestjs/common';
import { Booking } from './booking.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomParseIntPipe } from 'src/common/pipes/customParseIntPipe/CustomParseIntPipe';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './createBooking.dto';
import { RolesGuard } from 'src/guards/rolesGuard/roles.guard';
import { Roles } from 'src/guards/rolesGuard/roles.decorator';
import { UserRoles } from 'src/userRoles/userRoles.enum';
import { Request } from 'express';

@Controller('bookings')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingsService.getAllBookings();
  }

  @Post('/reserve')
  async createNewBooking(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return await this.bookingsService.createNewBooking(createBookingDto);
  }

  @Get(':bookingId')
  async getBookingById(@Param('bookingId', new CustomParseIntPipe('Booking ID')) bookingId: number): Promise<Booking> {
    return await this.bookingsService.getBookingById(bookingId);
  }

  @Delete(':bookingId')
  async deleteBookingById(
    @Param('bookingId', new CustomParseIntPipe('Booking ID')) bookingId: number,
    @Req() req: Request,
  ): Promise<{ success: boolean }> {
    return await this.bookingsService.deleteBookingById(bookingId, req.user);
  }
}
