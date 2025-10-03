import { Event } from 'src/events/event.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, RelationId, ManyToOne, JoinColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => Event, (event) => event.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @RelationId((booking: Booking) => booking.event)
  eventId: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((booking: Booking) => booking.user)
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
