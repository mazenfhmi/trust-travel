import { IsNumber, IsString, IsNotEmpty, IsEnum, IsPositive } from 'class-validator';

export enum PaymentMethodEnum {
  CREDIT_CARD = 'CREDIT_CARD',
  MADA = 'MADA',
  APPLE_PAY = 'APPLE_PAY',
}

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(PaymentMethodEnum)
  method: PaymentMethodEnum;

  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  bookingType: string;
}

export class PaymentResponseDto {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  bookingType: string;
  bookingRef: string;
  gatewayRef?: string;
  paidAt?: Date;
  createdAt: Date;
}

export class RefundDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
