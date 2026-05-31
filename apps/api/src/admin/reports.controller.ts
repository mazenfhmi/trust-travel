import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FinancialReportQueryDto } from './dto/financial-report-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import type { Response } from 'express';

@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  @Roles('SUPER_ADMIN', 'FINANCE_VIEWER')
  getFinancialReport(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.generateFinancialReport(query);
  }

  @Get('financial/export')
  @Roles('SUPER_ADMIN', 'FINANCE_VIEWER')
  async exportFinancialReport(
    @Query() query: FinancialReportQueryDto,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    if (format === 'CSV') {
      const csv = await this.reportsService.exportAsCsv(query);
      res.header('Content-Type', 'text/csv');
      res.attachment('financial-report.csv');
      return res.send(csv);
    }
    // For PDF, we would generate a PDF, but mock it for now
    res.status(400).send({ message: 'Unsupported format' });
  }
}
