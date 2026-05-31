import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialReportQueryDto } from './dto/financial-report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFinancialReport(query: FinancialReportQueryDto) {
    const { from, to, serviceType, paymentStatus, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }
    if (serviceType && serviceType !== 'ALL') {
      where.bookingType = serviceType;
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      where.status = paymentStatus;
    }

    const [totalRevenueResult, totalCount, data] = await Promise.all([
      this.prisma.payment.aggregate({
        where,
        _sum: { amount: true },
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // get breakdown
    const flightsRevenue = await this.prisma.payment.aggregate({
      where: { ...where, bookingType: 'FLIGHT' },
      _sum: { amount: true },
    });
    const flightsCount = await this.prisma.payment.count({
      where: { ...where, bookingType: 'FLIGHT' },
    });

    const hotelsRevenue = await this.prisma.payment.aggregate({
      where: { ...where, bookingType: 'HOTEL' },
      _sum: { amount: true },
    });
    const hotelsCount = await this.prisma.payment.count({
      where: { ...where, bookingType: 'HOTEL' },
    });

    return {
      summary: {
        totalRevenue: Number(totalRevenueResult._sum.amount || 0),
        totalTransactions: totalCount,
        byService: {
          FLIGHT: { revenue: Number(flightsRevenue._sum.amount || 0), count: flightsCount },
          HOTEL: { revenue: Number(hotelsRevenue._sum.amount || 0), count: hotelsCount },
        },
        currency: 'SAR',
      },
      transactions: {
        data,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    };
  }

  async exportAsCsv(query: FinancialReportQueryDto) {
    const report = await this.generateFinancialReport({ ...query, page: 1, limit: 10000 });
    const headers = ['Payment Ref', 'Booking Ref', 'Type', 'Amount', 'Currency', 'Method', 'Status', 'Date'];
    const rows = report.transactions.data.map(p => [
      p.reference,
      p.bookingId,
      p.bookingType,
      p.amount,
      p.currency,
      p.method,
      p.status,
      p.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }
}
