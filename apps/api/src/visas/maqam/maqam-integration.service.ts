import { Injectable, Logger } from '@nestjs/common';
import { VisaStatus } from '@prisma/client';

@Injectable()
export class MaqamIntegrationService {
  private readonly logger = new Logger(MaqamIntegrationService.name);

  async submitToMaqam(applicationId: string, data: any): Promise<{ success: boolean; reference?: string; error?: string }> {
    this.logger.log(`Submitting application ${applicationId} to Maqam (MOCK)`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    if (Math.random() < 0.1) {
      return { success: false, error: 'Connection timeout' };
    }

    return {
      success: true,
      reference: `MQM-${Math.floor(Math.random() * 1000000)}`,
    };
  }

  async pollStatus(reference: string): Promise<VisaStatus> {
    this.logger.log(`Polling status for Maqam reference ${reference} (MOCK)`);
    
    // Simulate 10% chance of being approved on each poll
    if (Math.random() < 0.1) {
      return VisaStatus.MAQAM_ACCEPTED;
    }
    
    return VisaStatus.SUBMITTED_TO_MAQAM;
  }
}
