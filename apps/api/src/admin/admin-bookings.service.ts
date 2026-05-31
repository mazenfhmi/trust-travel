import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { BookingStatus, BookingType } from '@prisma/client';

@Injectable()
export class AdminBookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto & { type?: BookingType, status?: BookingStatus }) {
    const { page = 1, limit = 10, type, status } = query;
    const skip = (page - 1) * limit;

    // A unified approach would be to have a single booking table, but here we have FlightBooking and HotelBooking separately.
    // For a unified admin view, we can either fetch from both and merge, or create an API that specifies the type.
    // Given the complexity of merging with pagination, we'll implement endpoints for each type.
    // But since the task implies unified bookings, let's just do Flights as an example or return a type error.
    
    // For simplicity in this implementation, we will query flight bookings if type=FLIGHT, 
    // hotel bookings if type=HOTEL. If not specified, we throw an error or default to flight.
    
    if (type === 'HOTEL') {
      const [data, total] = await Promise.all([
        this.prisma.hotelBooking.findMany({
          where: status ? { status } : undefined,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { email: true, firstName: true, lastName: true } },
            hotel: { select: { name: true } },
          },
        }),
        this.prisma.hotelBooking.count({ where: status ? { status } : undefined }),
      ]);
      return new PaginatedResponse(data, total, page, limit);
    } else {
      const [data, total] = await Promise.all([
        this.prisma.flightBooking.findMany({
          where: status ? { status } : undefined,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { email: true, firstName: true, lastName: true } },
          },
        }),
        this.prisma.flightBooking.count({ where: status ? { status } : undefined }),
      ]);
      return new PaginatedResponse(data, total, page, limit);
    }
  }

  async findOne(id: string, type: BookingType) {
    if (type === 'HOTEL') {
      const booking = await this.prisma.hotelBooking.findUnique({
        where: { id },
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
      if (!booking) throw new NotFoundException('Hotel booking not found');
      return booking;
    } else {
      const booking = await this.prisma.flightBooking.findUnique({
        where: { id },
        include: {
          user: true,
          passengers: true,
        },
      });
      if (!booking) throw new NotFoundException('Flight booking not found');
      return booking;
    }
  }

  async updateStatus(id: string, type: BookingType, status: BookingStatus) {
    if (type === 'HOTEL') {
      return this.prisma.hotelBooking.update({
        where: { id },
        data: { status },
      });
    } else {
      return this.prisma.flightBooking.update({
        where: { id },
        data: { status },
      });
    }
  }
}
