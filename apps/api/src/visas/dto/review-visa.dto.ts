import { IsString, IsNotEmpty, IsOptional, ValidateIf, IsIn } from 'class-validator';

export class ReviewVisaDto {
  @IsString()
  @IsIn(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsString()
  @IsOptional()
  notes?: string;

  @ValidateIf(o => o.action === 'REJECT')
  @IsString()
  @IsNotEmpty({ message: 'rejectionReason is required when action is REJECT' })
  rejectionReason?: string;
}
