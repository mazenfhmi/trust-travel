import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../prisma/prisma.service';
import { HOTEL_PROVIDER } from './providers/hotel-provider.interface';
import { PaymentsService } from '../payments/payments.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;
  let prisma: PrismaService;
  let provider: any;
  let payments: any;

  beforeEach(async () => {
    provider = {
      checkAvailability: jest.fn(),
      getHotelDetails: jest.fn(),
    };

    payments = {
      createPayment: jest.fn().mockResolvedValue({ paymentUrl: 'http://pay.mock' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: {
            hotel: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            room: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            hotelBooking: {
              create: jest.fn(),
            },
          },
        },
        { provide: HOTEL_PROVIDER, useValue: provider },
        { provide: PaymentsService, useValue: payments },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('checkAvailability', () => {
    it('should check availability via provider', async () => {
      provider.checkAvailability.mockResolvedValue({ available: true, totalPrice: 500, currency: 'SAR', totalNights: 2 });
      
      const result = await service.checkAvailability('hotel-1', 'room-1', '2026-07-01', '2026-07-03');
      expect(result.available).toBe(true);
      expect(result.totalPrice).toBe(500);
    });
  });

  describe('bookRoom', () => {
    const dto = {
      hotelId: 'hotel-1',
      roomId: 'room-1',
      checkIn: '2026-07-01',
      checkOut: '2026-07-03',
      guestCount: 2,
    };

    it('should book a room and generate a payment URL', async () => {
      provider.getHotelDetails.mockResolvedValue({
        name: 'Mock Hotel',
        rooms: [{ id: 'room-1', capacity: 2, type: 'Standard', pricePerNight: { amount: 250, currency: 'SAR' } }],
      });
      provider.checkAvailability.mockResolvedValue({ available: true, totalPrice: 500, currency: 'SAR', totalNights: 2 });
      
      jest.spyOn(prisma.hotel, 'findFirst').mockResolvedValue({ id: 'db-hotel-1' } as any);
      jest.spyOn(prisma.room, 'findFirst').mockResolvedValue({ id: 'db-room-1' } as any);
      jest.spyOn(prisma.hotelBooking, 'create').mockResolvedValue({ id: 'booking-1', reference: 'TT-HT-123', status: 'PENDING' } as any);

      const result = await service.bookRoom('user-1', dto);
      expect(result.paymentUrl).toBe('http://pay.mock');
      expect(payments.createPayment).toHaveBeenCalled();
    });

    it('should throw NotFoundException if hotel not found', async () => {
      provider.getHotelDetails.mockResolvedValue(null);
      await expect(service.bookRoom('user-1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if capacity exceeded', async () => {
      provider.getHotelDetails.mockResolvedValue({
        name: 'Mock Hotel',
        rooms: [{ id: 'room-1', capacity: 1, type: 'Standard', pricePerNight: { amount: 250, currency: 'SAR' } }],
      });
      provider.checkAvailability.mockResolvedValue({ available: true, totalPrice: 500, currency: 'SAR', totalNights: 2 });

      await expect(service.bookRoom('user-1', dto)).rejects.toThrow(BadRequestException);
    });
  });
});
