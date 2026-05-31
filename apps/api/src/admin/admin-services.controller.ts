import { Controller, Get, Param, Patch, Body, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminServicesService } from './admin-services.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Services')
@ApiBearerAuth()
@Controller('admin/services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.VISA_REVIEWER) // Depends on the exact service, simplify for now
@UseInterceptors(AuditInterceptor)
export class AdminServicesController {
  constructor(private readonly adminServicesService: AdminServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of services (Hotels, etc)' })
  findAll(@Query() query: PaginationQueryDto & { type?: 'FLIGHT' | 'HOTEL' | 'VISA', isActive?: boolean }) {
    return this.adminServicesService.findAll(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service status (Active/Inactive)' })
  updateStatus(
    @Param('id') id: string, 
    @Query('type') type: 'FLIGHT' | 'HOTEL' | 'VISA',
    @Body('isActive') isActive: boolean
  ) {
    return this.adminServicesService.updateStatus(id, type, isActive);
  }
}
