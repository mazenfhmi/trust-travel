import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaqamIntegrationService } from './maqam-integration.service';
import { VisaStatus } from '@prisma/client';

@Processor('visa-maqam-queue')
export class MaqamProcessor extends WorkerHost {
  private readonly logger = new Logger(MaqamProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly maqamIntegration: MaqamIntegrationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'submit') {
      return this.handleSubmit(job.data);
    }

    throw new Error(`Unknown job type: ${job.name}`);
  }

  private async handleSubmit(data: { applicationId: string }) {
    const { applicationId } = data;
    
    const application = await this.prisma.visaApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.status !== VisaStatus.APPROVED) {
      this.logger.warn(`Application ${applicationId} is not in APPROVED status or not found`);
      return;
    }

    const result = await this.maqamIntegration.submitToMaqam(applicationId, application);

    if (!result.success) {
      // Throw error to trigger BullMQ retry mechanism
      throw new Error(`Failed to submit to Maqam: ${result.error}`);
    }

    // Update status to SUBMITTED_TO_MAQAM
    await this.prisma.visaApplication.update({
      where: { id: applicationId },
      data: {
        status: VisaStatus.SUBMITTED_TO_MAQAM,
        maqamReference: result.reference,
        // In a real app, we'd add maqamSubmittedAt, but it's not in the Prisma schema right now
        // maqamSubmittedAt: new Date(),
      },
    });

    this.logger.log(`Successfully submitted application ${applicationId} to Maqam. Ref: ${result.reference}`);
    return result;
  }
}
