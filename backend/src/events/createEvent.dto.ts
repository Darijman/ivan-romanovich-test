import { IsNotEmpty, IsString, MaxLength, IsInt, Min, Matches, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Name must not exceed 255 characters!' })
  @MinLength(1, { message: 'Name must contain at least 1 character!' })
  @Matches(/\S/, { message: 'Name should not be empty or contain only spaces!' })
  name: string;

  @IsInt({ message: 'Total seats must be an integer!' })
  @Min(1, { message: 'Total seats must be at least 1!' })
  totalSeats: number;
}
