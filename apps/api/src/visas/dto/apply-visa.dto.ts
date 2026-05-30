import { IsString, IsNotEmpty, IsISO31661Alpha2, IsDateString } from 'class-validator';

export class ApplyVisaDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsISO31661Alpha2()
  nationality: string;

  @IsDateString()
  dateOfBirth: string;
}
