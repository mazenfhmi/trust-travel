import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PassengerTypeEnum {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

export class PassengerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(PassengerTypeEnum)
  type: PassengerTypeEnum;
}

export class BookFlightDto {
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];

  @IsEmail()
  contactEmail: string;
}
