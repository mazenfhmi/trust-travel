import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN) // Only super admins can view audit logs
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of audit logs' })
  findAll(@Query() query: PaginationQueryDto & { userId?: string; entity?: string }) {
    return this.auditLogsService.findAll(query);
  }
}
