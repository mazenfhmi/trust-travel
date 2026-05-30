import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VisasService } from './visas.service';
import { ApplyVisaDto } from './dto/apply-visa.dto';
import { ReviewVisaDto } from './dto/review-visa.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, VisaStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('v1/visas')
export class VisasController {
  constructor(
    private readonly visasService: VisasService,
    @InjectQueue('visa-maqam-queue') private readonly maqamQueue: Queue,
  ) {}

  @Post('apply')
  @Roles(UserRole.TRAVELER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'passportScan', maxCount: 1 },
      { name: 'personalPhoto', maxCount: 1 },
    ])
  )
  async apply(
    @CurrentUser() user: any,
    @Body() applyVisaDto: ApplyVisaDto,
    @UploadedFiles() files: { passportScan?: Express.Multer.File[]; personalPhoto?: Express.Multer.File[] },
  ) {
    const passportScan = files?.passportScan?.[0];
    const personalPhoto = files?.personalPhoto?.[0];
    return this.visasService.applyForVisa(user.sub, applyVisaDto, passportScan as Express.Multer.File, personalPhoto as Express.Multer.File);
  }

  @Get('my-applications')
  @Roles(UserRole.TRAVELER)
  async getMyApplications(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: VisaStatus,
  ) {
    return this.visasService.listMyApplications(user.sub, page, limit, status);
  }

  @Get('admin/queue')
  @Roles(UserRole.VISA_REVIEWER, UserRole.SUPER_ADMIN)
  async getAdminQueue(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: VisaStatus,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ) {
    return this.visasService.listAdminQueue(page, limit, status, sortBy);
  }

  @Get(':id')
  async getApplication(@CurrentUser() user: any, @Param('id') id: string) {
    const isAdmin = [UserRole.VISA_REVIEWER, UserRole.SUPER_ADMIN].includes(user.role);
    return this.visasService.getApplication(user.sub, id, isAdmin);
  }

  @Patch('admin/:id/review')
  @Roles(UserRole.VISA_REVIEWER, UserRole.SUPER_ADMIN)
  async reviewApplication(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() reviewVisaDto: ReviewVisaDto,
  ) {
    return this.visasService.reviewApplication(user.sub, id, reviewVisaDto);
  }

  @Post('admin/:id/submit-to-maqam')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(UserRole.VISA_REVIEWER, UserRole.SUPER_ADMIN)
  async submitToMaqam(@Param('id') id: string) {
    // We just enqueue the job. The processor handles fetching and validating status.
    await this.maqamQueue.add(
      'submit',
      { applicationId: id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      }
    );

    return {
      id,
      status: 'QUEUED_FOR_MAQAM',
      message: 'Application queued for Maqam submission',
    };
  }
}
