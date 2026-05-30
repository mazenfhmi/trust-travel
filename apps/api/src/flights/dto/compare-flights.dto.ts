import { IsArray, ArrayMinSize, ArrayMaxSize, IsString } from 'class-validator';

export class CompareFlightsDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  flightIds: string[];
}
