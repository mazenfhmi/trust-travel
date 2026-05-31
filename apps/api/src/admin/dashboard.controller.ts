import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles('BOOKING_AGENT', 'SUPER_ADMIN', 'FINANCE_VIEWER')
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
