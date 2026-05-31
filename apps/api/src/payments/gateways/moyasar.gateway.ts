import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
    const gatewayRef = `moyasar_${randomUUID().replace(/-/g, '')}`;

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
      gatewayRef: `mock_txn_${randomUUID().replace(/-/g, '')}`,
      status: 'refunded',
    };
  }
}
