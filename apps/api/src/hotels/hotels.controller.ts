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
import { HotelsService } from './hotels.service';
import { RoomsService } from './rooms.service';
import { ReviewsService } from './reviews.service';
import { SearchHotelsQueryDto } from './dto/search-hotels.dto';
import { BookHotelDto } from './dto/book-hotel.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HOTEL_PROVIDER, HotelProviderInterface } from './providers/hotel-provider.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

class CancelBookingDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly roomsService: RoomsService,
    private readonly reviewsService: ReviewsService,
    @Inject(HOTEL_PROVIDER) private readonly hotelProvider: HotelProviderInterface,
  ) {}

  @Public()
  @Get('search')
  search(@Query() query: SearchHotelsQueryDto) {
    return this.hotelProvider.search(query);
  }

  @Public()
  @Get(':hotelId')
  async getHotelDetails(@Param('hotelId') hotelId: string) {
    const details = await this.hotelProvider.getHotelDetails(hotelId);
    if (!details) {
      throw new NotFoundException(`Hotel ${hotelId} not found`);
    }
    const reviews = await this.reviewsService.getReviewsByHotel(hotelId);
    return { ...details, reviews };
  }

  @Public()
  @Get(':hotelId/rooms/:roomId/availability')
  checkAvailability(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.roomsService.checkAvailability(hotelId, roomId, checkIn, checkOut);
  }

  @Post('book')
  @Roles('TRAVELER', 'BOOKING_AGENT', 'SUPER_ADMIN')
  bookRoom(@CurrentUser() user: any, @Body() dto: BookHotelDto) {
    return this.roomsService.bookRoom(user.id, dto);
  }

  @Get('bookings/all')
  listBookings(@CurrentUser() user: any, @Query() query: PaginationQueryDto) {
    return this.hotelsService.listBookings(user.id, user.role, query);
  }

  @Get('bookings/:id')
  getBooking(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.hotelsService.getBooking(id, user.id, user.role);
  }

  @Patch('bookings/:id/cancel')
  cancelBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() dto: CancelBookingDto,
  ) {
    return this.hotelsService.cancelBooking(id, user.id, user.role, dto.reason);
  }

  @Post(':hotelId/reviews')
  @Roles('TRAVELER')
  createReview(
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(hotelId, user.id, dto);
  }
}
