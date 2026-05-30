import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Service } from '../common/s3/s3.service';
import { DocumentType } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(private readonly s3Service: S3Service) {}

  validateDocument(file: Express.Multer.File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'File is required' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File exceeds 5 MB limit' };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { isValid: false, error: 'Invalid format. Accepted: JPEG, PNG' };
    }

    return { isValid: true };
  }

  async uploadDocument(type: DocumentType, file: Express.Multer.File): Promise<string> {
    const extension = file.originalname.split('.').pop();
    const key = `visas/${randomUUID()}.${extension}`;
    
    await this.s3Service.uploadFile(key, file);
    return key;
  }

  async getPresignedUrl(key: string): Promise<string> {
    return this.s3Service.getPresignedUrl(key);
  }
}
