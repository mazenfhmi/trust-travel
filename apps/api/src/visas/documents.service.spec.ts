import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { S3Service } from '../common/s3/s3.service';
import { BadRequestException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            getPresignedUrl: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateDocument', () => {
    it('should return true for valid document', () => {
      const result = service.validateDocument({ mimetype: 'image/jpeg', size: 1024 } as any);
      expect(result.isValid).toBe(true);
    });

    it('should return false if size exceeds 5MB', () => {
      const result = service.validateDocument({ mimetype: 'image/jpeg', size: 6 * 1024 * 1024 } as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('size');
    });

    it('should return false for invalid mimetype', () => {
      const result = service.validateDocument({ mimetype: 'application/pdf', size: 1024 } as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('format');
    });
  });

  describe('uploadDocument', () => {
    it('should upload file via S3Service and return key', async () => {
      jest.spyOn(s3Service, 'uploadFile').mockResolvedValue('test-key');
      const key = await service.uploadDocument(DocumentType.PASSPORT_SCAN, { buffer: Buffer.from('test'), mimetype: 'image/jpeg', size: 1024 } as any);
      expect(key).toBe('test-key');
      expect(s3Service.uploadFile).toHaveBeenCalled();
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate a presigned URL', async () => {
      jest.spyOn(s3Service, 'getPresignedUrl').mockResolvedValue('https://presigned.url');
      const url = await service.getPresignedUrl('test-key');
      expect(url).toBe('https://presigned.url');
    });
  });
});
