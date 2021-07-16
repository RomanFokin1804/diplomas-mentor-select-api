import { UserRole } from '../enum/user-role.enum';

export class CreateUserDto {
  readonly login: string;
  readonly password: string;
  readonly role: UserRole;
}
