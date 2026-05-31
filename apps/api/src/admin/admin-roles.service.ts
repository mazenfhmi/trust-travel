import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    // Roles are enums, so we can't easily paginate them from the DB like a regular table,
    // but we can return the list of roles and the count of users per role.
    
    const roles = Object.values(UserRole);
    const skip = (page - 1) * limit;
    const paginatedRoles = roles.slice(skip, skip + limit);

    // Get counts for each role
    const rolesData = await Promise.all(paginatedRoles.map(async (role) => {
      const count = await this.prisma.user.count({ where: { role } });
      return {
        role,
        userCount: count,
        department: this.getDepartmentForRole(role),
      };
    }));

    return new PaginatedResponse(rolesData, roles.length, page, limit);
  }

  private getDepartmentForRole(role: UserRole) {
    switch(role) {
      case UserRole.SUPER_ADMIN: return 'Management';
      case UserRole.BOOKING_AGENT: return 'Support & Bookings';
      case UserRole.VISA_REVIEWER: return 'Visa Processing';
      case UserRole.FINANCE_VIEWER: return 'Finance';
      case UserRole.TRAVELER: return 'Customers';
      default: return 'Unknown';
    }
  }
}
