import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsQueryDto } from './dto/search-flights.dto';
import { CompareFlightsDto } from './dto/compare-flights.dto';
import { BookFlightDto } from './dto/book-flight.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsNotEmpty } from 'class-validator';

class CancelBookingDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Public()
  @Get('search')
  search(@Query() query: SearchFlightsQueryDto) {
    return this.flightsService.search(query);
  }

  @Public()
  @Post('compare')
  @HttpCode(HttpStatus.OK)
  compare(@Body() dto: CompareFlightsDto) {
    return this.flightsService.compare(dto);
  }

  @Post('book')
  @Roles('TRAVELER', 'BOOKING_AGENT', 'SUPER_ADMIN')
  bookFlight(@CurrentUser() user: any, @Body() dto: BookFlightDto) {
    return this.flightsService.bookFlight(user.id, dto);
  }

  @Get()
  listBookings(@CurrentUser() user: any, @Query() query: PaginationQueryDto) {
    return this.flightsService.listBookings(user.id, user.role, query);
  }

  @Get(':id')
  getBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.flightsService.getBooking(id, user.id, user.role);
  }

  @Patch(':id/cancel')
  cancelBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() dto: CancelBookingDto,
  ) {
    return this.flightsService.cancelBooking(id, user.id, user.role, dto.reason);
  }
}
