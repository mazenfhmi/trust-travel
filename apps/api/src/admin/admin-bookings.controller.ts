import { Controller, Get, Param, Patch, Body, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminBookingsService } from './admin-bookings.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { BookingStatus, BookingType, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Bookings')
@ApiBearerAuth()
@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.BOOKING_AGENT) // Both admins and booking agents
@UseInterceptors(AuditInterceptor)
export class AdminBookingsController {
  constructor(private readonly adminBookingsService: AdminBookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of bookings (Specify type: FLIGHT or HOTEL)' })
  findAll(@Query() query: PaginationQueryDto & { type?: BookingType, status?: BookingStatus }) {
    return this.adminBookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific booking' })
  findOne(@Param('id') id: string, @Query('type') type: BookingType) {
    return this.adminBookingsService.findOne(id, type);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update a booking status' })
  updateStatus(
    @Param('id') id: string, 
    @Query('type') type: BookingType,
    @Body('status') status: BookingStatus
  ) {
    return this.adminBookingsService.updateStatus(id, type, status);
  }
}
