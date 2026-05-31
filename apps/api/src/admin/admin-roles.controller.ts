import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminRolesService } from './admin-roles.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Roles')
@ApiBearerAuth()
@Controller('admin/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@UseInterceptors(AuditInterceptor)
export class AdminRolesController {
  constructor(private readonly adminRolesService: AdminRolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of roles and departments' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.adminRolesService.findAll(query);
  }
}
