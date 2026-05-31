import { Test, TestingModule } from '@nestjs/testing';
import { HotelsService } from './hotels.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

describe('HotelsService', () => {
  let service: HotelsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsService,
        {
          provide: PrismaService,
          useValue: {
            hotelBooking: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HotelsService>(HotelsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('listBookings', () => {
    it('should list user bookings for TRAVELER', async () => {
      jest.spyOn(prisma.hotelBooking, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.hotelBooking, 'count').mockResolvedValue(0);

      const result = await service.listBookings('user-1', 'TRAVELER', { page: 1, limit: 10 });

      expect(result.data).toEqual([]);
      expect(prisma.hotelBooking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } })
      );
    });

    it('should list all bookings for SUPER_ADMIN', async () => {
      jest.spyOn(prisma.hotelBooking, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.hotelBooking, 'count').mockResolvedValue(0);

      await service.listBookings('admin-1', 'SUPER_ADMIN', { page: 1, limit: 10 });

      expect(prisma.hotelBooking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
    });
  });

  describe('getBooking', () => {
    it('should return booking for owner', async () => {
      jest.spyOn(prisma.hotelBooking, 'findUnique').mockResolvedValue({ id: 'booking-1', userId: 'user-1' } as any);

      const result = await service.getBooking('booking-1', 'user-1', 'TRAVELER');
      expect(result.id).toBe('booking-1');
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      jest.spyOn(prisma.hotelBooking, 'findUnique').mockResolvedValue({ id: 'booking-1', userId: 'user-2' } as any);

      await expect(service.getBooking('booking-1', 'user-1', 'TRAVELER')).rejects.toThrow(ForbiddenException);
    });

    it('should return booking for admin even if not owner', async () => {
      jest.spyOn(prisma.hotelBooking, 'findUnique').mockResolvedValue({ id: 'booking-1', userId: 'user-2' } as any);

      const result = await service.getBooking('booking-1', 'admin-1', 'SUPER_ADMIN');
      expect(result.id).toBe('booking-1');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking and update status', async () => {
      jest.spyOn(prisma.hotelBooking, 'findUnique').mockResolvedValue({ id: 'booking-1', userId: 'user-1', status: BookingStatus.CONFIRMED } as any);
      jest.spyOn(prisma.hotelBooking, 'update').mockResolvedValue({ id: 'booking-1', status: BookingStatus.CANCELLED } as any);

      const result = await service.cancelBooking('booking-1', 'user-1', 'TRAVELER', 'Changed plans');
      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it('should throw BadRequestException if already cancelled', async () => {
      jest.spyOn(prisma.hotelBooking, 'findUnique').mockResolvedValue({ id: 'booking-1', userId: 'user-1', status: BookingStatus.CANCELLED } as any);

      await expect(service.cancelBooking('booking-1', 'user-1', 'TRAVELER', 'Changed plans')).rejects.toThrow(BadRequestException);
    });
  });
});
