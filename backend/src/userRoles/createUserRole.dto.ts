import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { UserRoles } from './userRoles.enum';

export class CreateUserRoleDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEnum(UserRoles, { message: 'Invalid role value!' })
  @IsNotEmpty()
  @Matches(/\S/, { message: 'Name should not be empty or contain only spaces!' })
  name: UserRoles;
}
