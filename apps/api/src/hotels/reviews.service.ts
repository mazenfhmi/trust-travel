import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(hotelId: string, userId: string, dto: CreateReviewDto) {
    // Verify hotel exists
    const hotel = await this.prisma.hotel.findFirst({
      where: { providerRef: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${hotelId} not found`);
    }

    // Check user has a completed stay
    const completedBooking = await this.prisma.hotelBooking.findFirst({
      where: {
        userId,
        hotelId: hotel.id,
        status: 'CONFIRMED',
      },
    });

    if (!completedBooking) {
      throw new BadRequestException('You must have a confirmed stay to submit a review');
    }

    const review = await this.prisma.review.create({
      data: {
        hotelId: hotel.id,
        userId,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
      },
    });

    // Update hotel aggregate rating
    const stats = await this.prisma.review.aggregate({
      where: { hotelId: hotel.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.hotel.update({
      where: { id: hotel.id },
      data: {
        averageRating: stats._avg.rating,
        reviewCount: stats._count.rating,
      },
    });

    return review;
  }

  async getReviewsByHotel(hotelId: string, page = 1, limit = 5) {
    const hotel = await this.prisma.hotel.findFirst({ where: { providerRef: hotelId } });
    if (!hotel) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { hotelId: hotel.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.review.count({ where: { hotelId: hotel.id } }),
    ]);

    return {
      data: data.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        author: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
        createdAt: r.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
