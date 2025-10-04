import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Event } from 'src/events/event.entity';
import { UserRole } from 'src/userRoles/userRole.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event, UserRole]), UsersModule, forwardRef(() => AuthModule)],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
