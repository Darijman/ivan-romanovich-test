import { DataSource } from 'typeorm';
import { UserRole } from './userRoles/userRole.entity';
import { User } from './users/user.entity';
import { Booking } from './bookings/booking.entity';
import { Event } from './events/event.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [UserRole, User, Booking, Event],
  synchronize: false,
  timezone: 'Z',
});
