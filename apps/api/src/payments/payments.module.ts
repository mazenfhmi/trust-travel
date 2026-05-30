import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MoyasarGateway } from './gateways/moyasar.gateway';
import { PAYMENT_GATEWAY } from './gateways/payment-gateway.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: PAYMENT_GATEWAY,
      useClass: MoyasarGateway,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
