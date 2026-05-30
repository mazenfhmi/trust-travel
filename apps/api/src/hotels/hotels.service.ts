import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchHotelsQueryDto } from './dto/search-hotels.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async listBookings(userId: string, userRole: string, query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const isAdmin = ['BOOKING_AGENT', 'SUPER_ADMIN', 'FINANCE_VIEWER'].includes(userRole);
    const where = isAdmin ? {} : { userId };

    const [data, total] = await Promise.all([
      this.prisma.hotelBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { hotel: { select: { name: true } }, room: { select: { type: true } } },
      }),
      this.prisma.hotelBooking.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBooking(bookingId: string, userId: string, userRole: string) {
    const booking = await this.prisma.hotelBooking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
        room: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Hotel booking ${bookingId} not found`);
    }

    const canAccess =
      booking.userId === userId ||
      ['BOOKING_AGENT', 'SUPER_ADMIN', 'FINANCE_VIEWER'].includes(userRole);

    if (!canAccess) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string, userRole: string, reason: string) {
    const booking = await this.prisma.hotelBooking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException(`Hotel booking ${bookingId} not found`);
    }

    const canAccess =
      booking.userId === userId || ['BOOKING_AGENT', 'SUPER_ADMIN'].includes(userRole);

    if (!canAccess) throw new ForbiddenException('Access denied');
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    return this.prisma.hotelBooking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });
  }
}
