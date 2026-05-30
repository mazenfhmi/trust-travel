import { Injectable, Logger } from '@nestjs/common';
import { VisaStatus, BookingStatus } from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // In a real application, this would use nodemailer and an SMTP server or AWS SES.
  // We use a mock implementation for dev.
  async sendVisaStatusUpdate(email: string, reference: string, status: VisaStatus, reason?: string) {
    this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: Visa Application ${reference} Update | Status: ${status}`);
    if (reason) {
      this.logger.log(`Reason: ${reason}`);
    }
  }

  async sendBookingConfirmation(email: string, reference: string, type: string) {
    this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: Booking Confirmation ${reference} | Type: ${type}`);
  }

  async sendBookingCancellation(email: string, reference: string) {
    this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: Booking Cancellation ${reference}`);
  }
}
