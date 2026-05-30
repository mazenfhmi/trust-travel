import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VisasService } from './visas.service';
import { VisasController } from './visas.controller';
import { DocumentsService } from './documents.service';
import { S3Module } from '../common/s3/s3.module';
import { MaqamIntegrationService } from './maqam/maqam-integration.service';
import { MaqamProcessor } from './maqam/maqam.processor';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    S3Module,
    BullModule.registerQueue({
      name: 'visa-maqam-queue',
    }),
    NotificationsModule,
  ],
  controllers: [VisasController],
  providers: [
    VisasService,
    DocumentsService,
    MaqamIntegrationService,
    MaqamProcessor,
  ],
  exports: [VisasService],
})
export class VisasModule {}
