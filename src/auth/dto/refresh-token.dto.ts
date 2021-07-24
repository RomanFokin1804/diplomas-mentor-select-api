import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  readonly refreshToken: string;
}
