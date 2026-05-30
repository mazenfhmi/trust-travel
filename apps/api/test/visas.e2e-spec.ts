import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

describe('VisasModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let travelerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Create tokens for testing
    travelerToken = jwtService.sign({ sub: 'b5b8d227-2c94-4d89-9e8c-8d14db0b8e62', email: 'traveler@example.com', role: UserRole.TRAVELER, isActive: true });
    adminToken = jwtService.sign({ sub: 'e0123e4b-6e21-4d1a-8c10-9c2f5d7b5f13', email: 'visa-reviewer@trust-travel.com', role: UserRole.VISA_REVIEWER, isActive: true });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/visas/apply (POST)', () => {
    it('should create a visa application successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/visas/apply')
        .set('Authorization', `Bearer ${travelerToken}`)
        .field('fullName', 'John Doe')
        .field('passportNumber', 'US123456')
        .field('nationality', 'US')
        .field('dateOfBirth', '1990-01-01')
        .attach('passportScan', Buffer.from('test image'), 'passport.jpg')
        .attach('personalPhoto', Buffer.from('test image'), 'photo.jpg')
        .expect(201);

      expect(response.body.data.status).toBe('PENDING');
      expect(response.body.data.documents.length).toBe(2);
    });
  });

  describe('/api/v1/visas/admin/queue (GET)', () => {
    it('should deny access to traveler', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/visas/admin/queue')
        .set('Authorization', `Bearer ${travelerToken}`)
        .expect(403);
    });

    it('should allow access to visa reviewer', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/visas/admin/queue')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
