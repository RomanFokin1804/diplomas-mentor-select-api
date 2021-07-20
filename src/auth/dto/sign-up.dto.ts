import { UserRole } from '../../users/enum/user-role.enum';

export class SignUpDto {
  readonly login: string;
  password: string;
  readonly role: UserRole;
}
