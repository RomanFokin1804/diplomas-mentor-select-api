import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  @IsEmail({}, { message: 'Incorrect Email' })
  readonly login: string;
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  @Length(4, 16, { message: 'Length must be more than 4 and less than 16!' })
  readonly password: string;
}
