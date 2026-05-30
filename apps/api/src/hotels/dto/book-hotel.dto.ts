import { IsString, IsNotEmpty, IsDateString, IsInt, IsEmail, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BookHotelDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guestCount: number;

  @IsEmail()
  contactEmail: string;
}
