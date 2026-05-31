import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, VisaStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      flightTotal, flightConfirmed, flightPending, flightCancelled,
      hotelTotal, hotelConfirmed, hotelPending, hotelCancelled,
      visaTotal, visaPending, visaUnderReview, visaApproved, visaRejected,
      payments
    ] = await Promise.all([
      this.prisma.flightBooking.count(),
      this.prisma.flightBooking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.flightBooking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.flightBooking.count({ where: { status: BookingStatus.CANCELLED } }),
      this.prisma.hotelBooking.count(),
      this.prisma.hotelBooking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.hotelBooking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.hotelBooking.count({ where: { status: BookingStatus.CANCELLED } }),
      this.prisma.visaApplication.count(),
      this.prisma.visaApplication.count({ where: { status: VisaStatus.PENDING } }),
      this.prisma.visaApplication.count({ where: { status: VisaStatus.UNDER_REVIEW } }),
      this.prisma.visaApplication.count({ where: { status: VisaStatus.APPROVED } }),
      this.prisma.visaApplication.count({ where: { status: VisaStatus.REJECTED } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    // calculate "thisMonth" revenue (just a mock estimate for now, or actual if needed)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthPayments = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    return {
      flights: {
        total: flightTotal,
        confirmed: flightConfirmed,
        pending: flightPending,
        cancelled: flightCancelled,
      },
      hotels: {
        total: hotelTotal,
        confirmed: hotelConfirmed,
        pending: hotelPending,
        cancelled: hotelCancelled,
      },
      visas: {
        total: visaTotal,
        pending: visaPending,
        underReview: visaUnderReview,
        approved: visaApproved,
        rejected: visaRejected,
      },
      revenue: {
        total: Number(payments._sum.amount || 0),
        currency: 'SAR',
        thisMonth: Number(thisMonthPayments._sum.amount || 0),
      },
    };
  }
}
