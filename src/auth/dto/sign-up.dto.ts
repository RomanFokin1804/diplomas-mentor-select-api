import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from '../../users/enum/user-role.enum';

export class SignUpDto {
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  @IsEmail({}, { message: 'Incorrect Email' })
  readonly login: string;
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  @Length(4, 16, { message: 'Length must be more than 4 and less than 16!' })
  password: string;
  @IsNotEmpty({ message: 'Must be not empty!' })
  readonly role: UserRole;
}
