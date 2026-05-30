import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FLIGHT_PROVIDER, FlightProviderInterface } from './providers/flight-provider.interface';
import { SearchFlightsQueryDto } from './dto/search-flights.dto';
import { CompareFlightsDto } from './dto/compare-flights.dto';
import { BookFlightDto } from './dto/book-flight.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { BookingStatus, BookingType } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class FlightsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FLIGHT_PROVIDER) private readonly flightProvider: FlightProviderInterface,
    private readonly paymentsService: PaymentsService,
  ) {}

  async search(params: SearchFlightsQueryDto) {
    return this.flightProvider.search({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      passengers: params.passengers,
      cabinClass: params.cabinClass,
    });
  }

  async compare(dto: CompareFlightsDto) {
    const flights = await Promise.all(
      dto.flightIds.map((id) => this.flightProvider.getFlightDetails(id)),
    );

    const notFound = dto.flightIds.filter((_, i) => !flights[i]);
    if (notFound.length > 0) {
      throw new NotFoundException(`Flights not found: ${notFound.join(', ')}`);
    }

    return { flights };
  }

  async bookFlight(userId: string, dto: BookFlightDto, paymentService?: any) {
    const flight = await this.flightProvider.getFlightDetails(dto.flightId);
    if (!flight) {
      throw new NotFoundException(`Flight ${dto.flightId} not found`);
    }

    const holdResult = await this.flightProvider.holdSeat(dto.flightId, dto.passengers.length);
    if (!holdResult.held) {
      throw new BadRequestException('No seats available for this flight');
    }

    const reference = `TT-FL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const totalAmount = flight.price.amount * dto.passengers.length;

    const booking = await this.prisma.flightBooking.create({
      data: {
        reference,
        userId,
        origin: flight.origin,
        destination: flight.destination,
        departureDate: new Date(flight.departureTime),
        returnDate: null,
        airline: flight.airline,
        cabinClass: flight.cabinClass as any,
        totalAmount,
        currency: flight.price.currency,
        status: BookingStatus.PENDING,
        providerRef: dto.flightId,
        passengers: {
          create: dto.passengers.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            passportNumber: p.passportNumber,
            nationality: p.nationality,
            dateOfBirth: new Date(p.dateOfBirth),
            type: p.type as any,
          })),
        },
      },
    });

    // T068: Wire payment flow — create Payment record and return Moyasar payment URL
    const { paymentUrl } = await this.paymentsService.createPayment({
      bookingId: booking.id,
      bookingType: BookingType.FLIGHT,
      amount: totalAmount,
      currency: flight.price.currency,
      method: 'CREDIT_CARD',
    });

    return {
      bookingId: booking.id,
      reference: booking.reference,
      status: booking.status,
      totalAmount: Number(booking.totalAmount),
      currency: booking.currency,
      paymentUrl,
    };
  }

  async getBooking(bookingId: string, userId: string, userRole: string) {
    const booking = await this.prisma.flightBooking.findUnique({
      where: { id: bookingId },
      include: {
        passengers: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Flight booking ${bookingId} not found`);
    }

    const canAccess =
      booking.userId === userId ||
      ['BOOKING_AGENT', 'SUPER_ADMIN', 'FINANCE_VIEWER'].includes(userRole);

    if (!canAccess) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: booking.id,
      reference: booking.reference,
      status: booking.status,
      origin: booking.origin,
      destination: booking.destination,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
      airline: booking.airline,
      cabinClass: booking.cabinClass,
      passengers: booking.passengers,
      totalAmount: Number(booking.totalAmount),
      currency: booking.currency,
      eTicketRef: booking.eTicketRef,
      payment: booking.payment
        ? { status: booking.payment.status, method: booking.payment.method }
        : null,
      createdAt: booking.createdAt,
    };
  }

  async listBookings(userId: string, userRole: string, query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const isAdmin = ['BOOKING_AGENT', 'SUPER_ADMIN', 'FINANCE_VIEWER'].includes(userRole);
    const where = isAdmin ? {} : { userId };

    const [data, total] = await Promise.all([
      this.prisma.flightBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { passengers: { take: 1 } },
      }),
      this.prisma.flightBooking.count({ where }),
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

  async cancelBooking(bookingId: string, userId: string, userRole: string, reason: string) {
    const booking = await this.prisma.flightBooking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException(`Flight booking ${bookingId} not found`);
    }

    const canAccess =
      booking.userId === userId ||
      ['BOOKING_AGENT', 'SUPER_ADMIN'].includes(userRole);

    if (!canAccess) {
      throw new ForbiddenException('Access denied');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updated = await this.prisma.flightBooking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    return {
      id: updated.id,
      reference: updated.reference,
      status: updated.status,
      cancellationReason: updated.cancellationReason,
    };
  }
}
