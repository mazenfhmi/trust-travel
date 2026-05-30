import { Test, TestingModule } from '@nestjs/testing';
import { VisasService } from './visas.service';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from './documents.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VisaStatus, ValidationStatus, DocumentType } from '@prisma/client';

describe('VisasService', () => {
  let service: VisasService;
  let prisma: PrismaService;
  let documentsService: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisasService,
        {
          provide: PrismaService,
          useValue: {
            visaApplication: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: DocumentsService,
          useValue: {
            uploadDocument: jest.fn(),
            validateDocument: jest.fn(),
            getPresignedUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VisasService>(VisasService);
    prisma = module.get<PrismaService>(PrismaService);
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('applyForVisa', () => {
    it('should create a new visa application with documents', async () => {
      // Mock documents validation and upload
      jest.spyOn(documentsService, 'uploadDocument').mockResolvedValue('key');
      jest.spyOn(prisma.visaApplication, 'create').mockResolvedValue({ id: 'app-1', status: VisaStatus.PENDING } as any);

      const result = await service.applyForVisa('user-1', {
        fullName: 'Test User',
        passportNumber: 'A1234567',
        nationality: 'SA',
        dateOfBirth: '1990-01-01',
        passportScan: { buffer: Buffer.from('test'), mimetype: 'image/jpeg', size: 1024 } as any,
        personalPhoto: { buffer: Buffer.from('test'), mimetype: 'image/jpeg', size: 1024 } as any,
      });

      expect(result.status).toBe(VisaStatus.PENDING);
      expect(prisma.visaApplication.create).toHaveBeenCalled();
      expect(documentsService.uploadDocument).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if files are missing', async () => {
      await expect(
        service.applyForVisa('user-1', {
          fullName: 'Test User',
          passportNumber: 'A1234567',
          nationality: 'SA',
          dateOfBirth: '1990-01-01',
        } as any)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getApplication', () => {
    it('should return application details if owned by user', async () => {
      jest.spyOn(prisma.visaApplication, 'findUnique').mockResolvedValue({ id: 'app-1', userId: 'user-1' } as any);
      
      const result = await service.getApplication('user-1', 'app-1');
      expect(result.id).toBe('app-1');
    });

    it('should throw NotFoundException if not found or unauthorized', async () => {
      jest.spyOn(prisma.visaApplication, 'findUnique').mockResolvedValue(null);
      await expect(service.getApplication('user-1', 'app-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reviewApplication', () => {
    it('should approve application and update status', async () => {
      jest.spyOn(prisma.visaApplication, 'findUnique').mockResolvedValue({ id: 'app-1', status: VisaStatus.PENDING } as any);
      jest.spyOn(prisma.visaApplication, 'update').mockResolvedValue({ id: 'app-1', status: VisaStatus.APPROVED } as any);

      const result = await service.reviewApplication('admin-1', 'app-1', { action: 'APPROVE', notes: 'OK' });
      expect(result.status).toBe(VisaStatus.APPROVED);
    });

    it('should throw BadRequestException if application already processed', async () => {
      jest.spyOn(prisma.visaApplication, 'findUnique').mockResolvedValue({ id: 'app-1', status: VisaStatus.APPROVED } as any);
      await expect(service.reviewApplication('admin-1', 'app-1', { action: 'APPROVE' })).rejects.toThrow(BadRequestException);
    });
  });
});
