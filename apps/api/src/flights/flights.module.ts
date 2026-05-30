import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { MockFlightProvider } from './providers/mock-flight.provider';
import { FLIGHT_PROVIDER } from './providers/flight-provider.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  controllers: [FlightsController],
  providers: [
    FlightsService,
    {
      provide: FLIGHT_PROVIDER,
      useClass: MockFlightProvider,
    },
  ],
  exports: [FlightsService],
})
export class FlightsModule {}

