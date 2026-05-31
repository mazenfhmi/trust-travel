import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto & { userId?: string; entity?: string }) {
    const { page = 1, limit = 10, userId, entity } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(userId && { userId }),
      ...(entity && { entity }),
    };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, firstName: true, lastName: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return new PaginatedResponse(data, total, page, limit);
  }
}
