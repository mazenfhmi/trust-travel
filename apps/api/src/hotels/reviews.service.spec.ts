import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: {
            hotel: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            hotelBooking: {
              findFirst: jest.fn(),
            },
            review: {
              create: jest.fn(),
              aggregate: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createReview', () => {
    const dto = { rating: 5, title: 'Great', body: 'Awesome stay' };

    it('should create review if user has confirmed booking', async () => {
      jest.spyOn(prisma.hotel, 'findFirst').mockResolvedValue({ id: 'hotel-1' } as any);
      jest.spyOn(prisma.hotelBooking, 'findFirst').mockResolvedValue({ id: 'booking-1' } as any);
      jest.spyOn(prisma.review, 'create').mockResolvedValue({ id: 'review-1' } as any);
      jest.spyOn(prisma.review, 'aggregate').mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 10 } } as any);

      const result = await service.createReview('provider-hotel-1', 'user-1', dto);

      expect(result.id).toBe('review-1');
      expect(prisma.hotel.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { averageRating: 4.5, reviewCount: 10 } })
      );
    });

    it('should throw BadRequestException if no confirmed booking', async () => {
      jest.spyOn(prisma.hotel, 'findFirst').mockResolvedValue({ id: 'hotel-1' } as any);
      jest.spyOn(prisma.hotelBooking, 'findFirst').mockResolvedValue(null);

      await expect(service.createReview('provider-hotel-1', 'user-1', dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReviewsByHotel', () => {
    it('should return list of reviews with author name', async () => {
      jest.spyOn(prisma.hotel, 'findFirst').mockResolvedValue({ id: 'hotel-1' } as any);
      jest.spyOn(prisma.review, 'count').mockResolvedValue(1);
      jest.spyOn(prisma.review, 'findMany').mockResolvedValue([
        {
          id: 'review-1',
          rating: 5,
          title: 'Great',
          body: 'Awesome',
          createdAt: new Date(),
          user: { firstName: 'Ali', lastName: 'Ahmad' },
        } as any
      ]);

      const result = await service.getReviewsByHotel('provider-hotel-1');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].author).toBe('Ali A.');
    });
  });
});
