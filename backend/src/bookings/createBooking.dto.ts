import { IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt({ message: 'userId must be an integer' })
  @Min(1, { message: 'userId must be at least 1' })
  userId: number;

  @IsInt({ message: 'eventId must be an integer' })
  @Min(1, { message: 'eventId must be at least 1' })
  eventId: number;
}
