import { VisaStatus, DocumentType, ValidationStatus } from '@prisma/client';

export class DocumentResponseDto {
  id: string;
  type: DocumentType;
  fileName: string;
  validationStatus: ValidationStatus;
  downloadUrl?: string;
}

export class VisaResponseDto {
  id: string;
  reference: string;
  status: VisaStatus;
  fullName: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: Date;
  documents?: DocumentResponseDto[];
  reviewerNotes?: string;
  rejectionReason?: string;
  maqamReference?: string;
  createdAt: Date;
  updatedAt: Date;
}
