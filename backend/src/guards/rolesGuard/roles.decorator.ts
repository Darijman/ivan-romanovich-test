import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/userRoles/userRoles.enum';

export const ROLES_KEY = 'roles';
type NonEmptyArray<T> = [T, ...T[]];

export function Roles(...roles: NonEmptyArray<UserRoles>) {
  return SetMetadata(ROLES_KEY, roles);
}
