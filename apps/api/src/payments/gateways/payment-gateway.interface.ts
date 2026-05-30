export interface CreatePaymentParams {
  amount: number;
  currency: string;
  method: string;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}

export interface PaymentGatewayResult {
  gatewayRef: string;
  paymentUrl: string;
  status: string;
}

export interface RefundParams {
  gatewayRef: string;
  amount: number;
  reason: string;
}

export interface RefundResult {
  gatewayRef: string;
  status: string;
}

export interface PaymentGatewayInterface {
  createPayment(params: CreatePaymentParams): Promise<PaymentGatewayResult>;
  verifyPayment(gatewayRef: string): Promise<{ status: string; paidAt?: string }>;
  refundPayment(params: RefundParams): Promise<RefundResult>;
}

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';
