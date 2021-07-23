import { IsNotEmpty, IsString } from 'class-validator';

export class ApprovedCodeDto {
  @IsNotEmpty({ message: 'Must be not empty!' })
  @IsString({ message: 'Must be string!' })
  readonly code: string;
}
