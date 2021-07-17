import { UserRole } from '../../users/enum/user-role.enum';

export class SignUpDto {
  readonly login: string;
  readonly password: string;
  readonly role: UserRole;
}
