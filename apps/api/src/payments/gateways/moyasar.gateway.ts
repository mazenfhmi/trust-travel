import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentGatewayInterface,
  CreatePaymentParams,
  PaymentGatewayResult,
  RefundParams,
  RefundResult,
} from './payment-gateway.interface';

/**
 * Mock implementation of the Moyasar payment gateway.
 * In production, replace with actual Moyasar API calls.
 */
@Injectable()
export class MoyasarGateway implements PaymentGatewayInterface {
  async createPayment(params: CreatePaymentParams): Promise<PaymentGatewayResult> {
    const gatewayRef = `moyasar_${uuidv4().replace(/-/g, '')}`;

    // Mock: returns a fake payment URL
    return {
      gatewayRef,
      paymentUrl: `https://api.moyasar.com/v1/payments/${gatewayRef}`,
      status: 'initiated',
    };
  }

  async verifyPayment(gatewayRef: string): Promise<{ status: string; paidAt?: string }> {
    // Mock: always returns completed for testing
    return {
      status: 'paid',
      paidAt: new Date().toISOString(),
    };
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    return {
      gatewayRef: `refund_${uuidv4().replace(/-/g, '')}`,
      status: 'refunded',
    };
  }
}
