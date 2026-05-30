import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { RoomsService } from './rooms.service';
import { ReviewsService } from './reviews.service';
import { MockHotelProvider } from './providers/mock-hotel.provider';
import { HOTEL_PROVIDER } from './providers/hotel-provider.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  controllers: [HotelsController],
  providers: [
    HotelsService,
    RoomsService,
    ReviewsService,
    {
      provide: HOTEL_PROVIDER,
      useClass: MockHotelProvider,
    },
  ],
  exports: [HotelsService, RoomsService, ReviewsService],
})
export class HotelsModule {}
