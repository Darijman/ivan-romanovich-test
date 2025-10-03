import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';

export class LoginUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email must contain no more than 255 characters!' })
  @IsNotEmpty()
  @Matches(/\S/, { message: 'Email should not be empty or contain only spaces!' })
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must contain at least 6 letters!' })
  @MaxLength(40, { message: 'Password must contain no more than 40 letters!' })
  @Matches(/\S/, { message: 'Password should not be empty or contain only spaces!' })
  password: string;
}
