import { IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt({ message: 'eventId must be an integer' })
  @Min(1, { message: 'eventId must be at least 1' })
  eventId: number;
}
