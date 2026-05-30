import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CabinClassEnum {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export class SearchFlightsQueryDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  departureDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9)
  passengers: number;

  @IsOptional()
  @IsEnum(CabinClassEnum)
  cabinClass?: CabinClassEnum = CabinClassEnum.ECONOMY;
}
