import { Controller, Get, Param, Patch, Body, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@UseInterceptors(AuditInterceptor)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of all users' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.adminUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific user' })
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update a user role' })
  updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminUsersService.updateRole(id, role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a user' })
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminUsersService.updateStatus(id, isActive);
  }
}
