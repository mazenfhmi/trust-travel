import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PAYMENT_GATEWAY, PaymentGatewayInterface } from './gateways/payment-gateway.interface';
import { RefundDto } from './dto/payment.dto';
import { BookingType, PaymentStatus, BookingStatus, RefundStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_GATEWAY) private readonly paymentGateway: PaymentGatewayInterface,
  ) {}

  async createPayment(params: {
    bookingId: string;
    bookingType: BookingType;
    amount: number;
    currency: string;
    method: string;
    callbackUrl?: string;
  }) {
    const reference = `TT-PY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const gatewayResult = await this.paymentGateway.createPayment({
      amount: params.amount,
      currency: params.currency,
      method: params.method,
      description: `${params.bookingType} booking ${params.bookingId}`,
      callbackUrl: params.callbackUrl ?? 'https://trust-travel.app/api/v1/payments/webhook',
      metadata: { bookingId: params.bookingId, bookingType: params.bookingType },
    });

    const payment = await this.prisma.payment.create({
      data: {
        reference,
        amount: params.amount,
        currency: params.currency,
        method: params.method as any,
        status: PaymentStatus.PENDING,
        gatewayRef: gatewayResult.gatewayRef,
        bookingType: params.bookingType,
        bookingId: params.bookingId,
      },
    });

    return { payment, paymentUrl: gatewayResult.paymentUrl };
  }

  async handleWebhook(payload: any) {
    const { gatewayRef, status } = payload;

    const payment = await this.prisma.payment.findFirst({
      where: { gatewayRef },
    });

    if (!payment) {
      return { received: true };
    }

    const isPaid = status === 'paid';
    const newPaymentStatus = isPaid ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newPaymentStatus,
        gatewayResponse: payload,
        paidAt: isPaid ? new Date() : null,
        failedAt: !isPaid ? new Date() : null,
        failureReason: !isPaid ? payload.message : null,
      },
    });

    if (isPaid) {
      // Update booking status based on type
      if (payment.bookingType === BookingType.FLIGHT) {
        const eTicketRef = `ET-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        await this.prisma.flightBooking.update({
          where: { id: payment.bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
            paymentId: payment.id,
            eTicketRef,
          },
        });
      } else if (payment.bookingType === BookingType.HOTEL) {
        await this.prisma.hotelBooking.update({
          where: { id: payment.bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
            paymentId: payment.id,
          },
        });
      }
    }

    return { received: true };
  }

  async getPayment(paymentId: string, userId: string, userRole: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }

    // Check access: owner (via booking) or finance role
    const isFinanceRole = ['FINANCE_VIEWER', 'SUPER_ADMIN', 'BOOKING_AGENT'].includes(userRole);
    if (!isFinanceRole) {
      // Verify user owns the booking
      let bookingUserId: string | null = null;
      if (payment.bookingType === BookingType.FLIGHT) {
        const booking = await this.prisma.flightBooking.findUnique({
          where: { id: payment.bookingId },
          select: { userId: true },
        });
        bookingUserId = booking?.userId ?? null;
      } else {
        const booking = await this.prisma.hotelBooking.findUnique({
          where: { id: payment.bookingId },
          select: { userId: true },
        });
        bookingUserId = booking?.userId ?? null;
      }

      if (bookingUserId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return {
      id: payment.id,
      reference: payment.reference,
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      bookingType: payment.bookingType,
      gatewayRef: payment.gatewayRef,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    };
  }

  async initiateRefund(paymentId: string, userId: string, userRole: string, dto: RefundDto) {
    const canRefund = ['BOOKING_AGENT', 'SUPER_ADMIN'].includes(userRole);
    if (!canRefund) {
      throw new ForbiddenException('Insufficient permissions to initiate refund');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    if (dto.amount > Number(payment.amount)) {
      throw new BadRequestException('Refund amount exceeds payment amount');
    }

    const gatewayResult = await this.paymentGateway.refundPayment({
      gatewayRef: payment.gatewayRef!,
      amount: dto.amount,
      reason: dto.reason,
    });

    const refund = await this.prisma.refund.create({
      data: {
        paymentId: payment.id,
        amount: dto.amount,
        reason: dto.reason,
        status: RefundStatus.PENDING,
        gatewayRef: gatewayResult.gatewayRef,
      },
    });

    return {
      id: refund.id,
      paymentId: refund.paymentId,
      amount: Number(refund.amount),
      reason: refund.reason,
      status: refund.status,
      createdAt: refund.createdAt,
    };
  }
}
