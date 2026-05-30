import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RefundDto } from './dto/payment.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }

  @Get(':id')
  getPayment(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.paymentsService.getPayment(id, user.id, user.role);
  }

  @Post(':id/refund')
  @Roles('BOOKING_AGENT', 'SUPER_ADMIN')
  initiateRefund(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() dto: RefundDto,
  ) {
    return this.paymentsService.initiateRefund(id, user.id, user.role, dto);
  }
}
