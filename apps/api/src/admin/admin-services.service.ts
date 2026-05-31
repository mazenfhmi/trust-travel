import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class AdminServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto & { type?: 'FLIGHT' | 'HOTEL' | 'VISA', isActive?: boolean }) {
    const { page = 1, limit = 10, type, isActive } = query;
    const skip = (page - 1) * limit;

    if (type === 'HOTEL') {
      const where = isActive !== undefined ? { isActive: String(isActive) === 'true' } : undefined;
      const [data, total] = await Promise.all([
        this.prisma.hotel.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.hotel.count({ where }),
      ]);
      return new PaginatedResponse(data, total, page, limit);
    } 
    
    // As per the specification, Services include Flights, Hotels, and Visas.
    // However, our database schema only has a 'Hotel' entity for services. 
    // Flights are usually searched dynamically, and Visas are applications.
    // For the sake of this mock service, we return empty if it's not HOTEL.
    return new PaginatedResponse([], 0, page, limit);
  }

  async updateStatus(id: string, type: 'FLIGHT' | 'HOTEL' | 'VISA', isActive: boolean) {
    if (type === 'HOTEL') {
      return this.prisma.hotel.update({
        where: { id },
        data: { isActive },
      });
    }
    throw new NotFoundException('Service type not supported for activation');
  }
}
