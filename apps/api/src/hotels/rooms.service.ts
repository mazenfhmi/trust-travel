import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HOTEL_PROVIDER, HotelProviderInterface } from './providers/hotel-provider.interface';
import { BookHotelDto } from './dto/book-hotel.dto';
import { PaymentsService } from '../payments/payments.service';
import { BookingStatus, BookingType } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(HOTEL_PROVIDER) private readonly hotelProvider: HotelProviderInterface,
    private readonly paymentsService: PaymentsService,
  ) {}

  async checkAvailability(hotelId: string, roomId: string, checkIn: string, checkOut: string) {
    const result = await this.hotelProvider.checkAvailability(hotelId, roomId, checkIn, checkOut);
    return { roomId, ...result };
  }

  async bookRoom(userId: string, dto: BookHotelDto) {
    const hotel = await this.hotelProvider.getHotelDetails(dto.hotelId);
    if (!hotel) throw new NotFoundException(`Hotel ${dto.hotelId} not found`);

    const room = hotel.rooms.find((r) => r.id === dto.roomId);
    if (!room) throw new NotFoundException(`Room ${dto.roomId} not found`);

    const availability = await this.hotelProvider.checkAvailability(
      dto.hotelId,
      dto.roomId,
      dto.checkIn,
      dto.checkOut,
    );

    if (!availability.available) {
      throw new BadRequestException('Room is not available for the selected dates');
    }

    if (dto.guestCount > room.capacity) {
      throw new BadRequestException(`Room capacity is ${room.capacity} guests`);
    }

    // Find or create Hotel & Room in DB (seed data is handled by mock provider)
    let dbHotel = await this.prisma.hotel.findFirst({ where: { providerRef: dto.hotelId } });
    if (!dbHotel) {
      dbHotel = await this.prisma.hotel.create({
        data: {
          name: hotel.name,
          nameAr: hotel.nameAr,
          city: hotel.city,
          address: hotel.address ?? 'Unknown',
          starRating: hotel.starRating,
          amenities: hotel.amenities,
          photos: hotel.photos ?? [],
          providerRef: dto.hotelId,
          isActive: true,
        },
      });
    }

    let dbRoom = await this.prisma.room.findFirst({
      where: { hotelId: dbHotel.id, type: room.type },
    });
    if (!dbRoom) {
      dbRoom = await this.prisma.room.create({
        data: {
          hotelId: dbHotel.id,
          type: room.type,
          typeAr: room.typeAr,
          capacity: room.capacity,
          pricePerNight: room.pricePerNight.amount,
          currency: room.pricePerNight.currency,
          totalInventory: 10,
          isActive: true,
        },
      });
    }

    const reference = `TT-HT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const booking = await this.prisma.hotelBooking.create({
      data: {
        reference,
        userId,
        hotelId: dbHotel.id,
        roomId: dbRoom.id,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
        guestCount: dto.guestCount,
        nights: availability.totalNights,
        totalAmount: availability.totalPrice,
        currency: availability.currency,
        status: BookingStatus.PENDING,
      },
    });

    // T084: Wire payment into RoomsService.bookRoom
    const { paymentUrl } = await this.paymentsService.createPayment({
      bookingId: booking.id,
      bookingType: BookingType.HOTEL,
      amount: availability.totalPrice,
      currency: availability.currency,
      method: 'CREDIT_CARD',
    });

    return {
      bookingId: booking.id,
      reference: booking.reference,
      status: booking.status,
      hotel: hotel.name,
      room: room.type,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      nights: availability.totalNights,
      totalAmount: availability.totalPrice,
      currency: availability.currency,
      paymentUrl,
    };
  }
}
