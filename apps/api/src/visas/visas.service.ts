import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from './documents.service';
import { ApplyVisaDto } from './dto/apply-visa.dto';
import { ReviewVisaDto } from './dto/review-visa.dto';
import { VisaStatus, DocumentType, ValidationStatus, NotificationType } from '@prisma/client';

import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../notifications/email.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class VisasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentsService: DocumentsService,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  private generateReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TT-VS-${result}`;
  }

  async applyForVisa(
    userId: string,
    dto: ApplyVisaDto,
    passportScan: Express.Multer.File,
    personalPhoto: Express.Multer.File,
  ) {
    if (!passportScan || !personalPhoto) {
      throw new BadRequestException('Both passportScan and personalPhoto are required');
    }

    const passportValidation = this.documentsService.validateDocument(passportScan);
    if (!passportValidation.isValid) {
      throw new BadRequestException([{ field: 'passportScan', error: passportValidation.error }]);
    }

    const photoValidation = this.documentsService.validateDocument(personalPhoto);
    if (!photoValidation.isValid) {
      throw new BadRequestException([{ field: 'personalPhoto', error: photoValidation.error }]);
    }

    const passportKey = await this.documentsService.uploadDocument(DocumentType.PASSPORT_SCAN, passportScan);
    const photoKey = await this.documentsService.uploadDocument(DocumentType.PERSONAL_PHOTO, personalPhoto);

    const application = await this.prisma.visaApplication.create({
      data: {
        userId,
        reference: this.generateReference(),
        fullName: dto.fullName,
        passportNumber: dto.passportNumber,
        nationality: dto.nationality,
        dateOfBirth: new Date(dto.dateOfBirth),
        status: VisaStatus.PENDING,
        documents: {
          create: [
            {
              type: DocumentType.PASSPORT_SCAN,
              storageKey: passportKey,
              fileName: passportScan.originalname,
              mimeType: passportScan.mimetype,
              sizeBytes: passportScan.size,
              validationStatus: ValidationStatus.VALID,
            },
            {
              type: DocumentType.PERSONAL_PHOTO,
              storageKey: photoKey,
              fileName: personalPhoto.originalname,
              mimeType: personalPhoto.mimetype,
              sizeBytes: personalPhoto.size,
              validationStatus: ValidationStatus.VALID,
            },
          ],
        },
      },
      include: {
        documents: true,
      },
    });

    // Send notifications
    await this.notificationsService.createNotification(
      userId,
      NotificationType.VISA_STATUS,
      'Visa Application Received',
      `Your visa application ${application.reference} has been received and is pending review.`
    );
    this.notificationsGateway.emitToUser(userId, 'visa:statusChanged', {
      applicationId: application.id,
      status: VisaStatus.PENDING,
    });

    return application;
  }

  async listMyApplications(userId: string, page = 1, limit = 20, status?: VisaStatus) {
    const skip = (page - 1) * limit;
    
    const where = {
      userId,
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.visaApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.visaApplication.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApplication(userId: string, id: string, isAdmin = false) {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      throw new NotFoundException('Visa application not found');
    }

    if (!isAdmin && application.userId !== userId) {
      throw new NotFoundException('Visa application not found');
    }

    // Generate presigned URLs for documents
    const documentsWithUrls = await Promise.all(
      application.documents.map(async (doc) => ({
        ...doc,
        downloadUrl: await this.documentsService.getPresignedUrl(doc.storageKey),
      }))
    );

    return {
      ...application,
      documents: documentsWithUrls,
    };
  }

  async listAdminQueue(page = 1, limit = 20, status?: VisaStatus, sortBy: 'asc' | 'desc' = 'asc') {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.prisma.visaApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortBy },
      }),
      this.prisma.visaApplication.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async reviewApplication(reviewerId: string, id: string, dto: ReviewVisaDto) {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Visa application not found');
    }

    if (application.status === VisaStatus.APPROVED || application.status === VisaStatus.REJECTED || application.status === VisaStatus.SUBMITTED_TO_MAQAM || application.status === VisaStatus.MAQAM_ACCEPTED || application.status === VisaStatus.MAQAM_REJECTED) {
      throw new BadRequestException('Application already processed');
    }

    const newStatus = dto.action === 'APPROVE' ? VisaStatus.APPROVED : VisaStatus.REJECTED;

    const updatedApplication = await this.prisma.visaApplication.update({
      where: { id },
      data: {
        status: newStatus,
        reviewerId,
        reviewerNotes: dto.notes,
        rejectionReason: dto.rejectionReason,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: application.userId } });

    if (newStatus === VisaStatus.APPROVED) {
      await this.notificationsService.createNotification(
        application.userId,
        NotificationType.VISA_STATUS,
        'Visa Application Approved',
        `Your visa application ${application.reference} has been approved.`
      );
      this.notificationsGateway.emitToUser(application.userId, 'visa:statusChanged', {
        applicationId: application.id,
        status: VisaStatus.APPROVED,
      });
      if (user) {
        await this.emailService.sendVisaStatusUpdate(user.email, application.reference, VisaStatus.APPROVED);
      }
    } else {
      await this.notificationsService.createNotification(
        application.userId,
        NotificationType.VISA_STATUS,
        'Visa Application Rejected',
        `Your visa application ${application.reference} has been rejected. Reason: ${dto.rejectionReason}`
      );
      this.notificationsGateway.emitToUser(application.userId, 'visa:statusChanged', {
        applicationId: application.id,
        status: VisaStatus.REJECTED,
      });
      if (user) {
        await this.emailService.sendVisaStatusUpdate(user.email, application.reference, VisaStatus.REJECTED, dto.rejectionReason);
      }
    }

    return updatedApplication;
  }
}
