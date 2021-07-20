import { IsEmail, IsString, Length } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';

export class CreateUserDto {
  @IsString({ message: 'Must be string!' })
  @IsEmail({}, { message: 'Incorrect Email' })
  readonly login: string;
  @IsString({ message: 'Must be string!' })
  @Length(4, 16, { message: 'Length must be more than 4 and less than 16!' })
  readonly password: string;
  readonly role: UserRole;
}
