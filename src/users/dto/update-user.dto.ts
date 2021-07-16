import { UserRole } from '../enum/user-role.enum';

export class UpdateUserDto {
  readonly login: string;
  readonly password: string;
  readonly role: UserRole;
}
