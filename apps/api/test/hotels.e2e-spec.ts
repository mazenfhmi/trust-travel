import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

describe('HotelsModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let travelerToken: string;
  let bookingAgentToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    travelerToken = jwtService.sign({ sub: 'b5b8d227-2c94-4d89-9e8c-8d14db0b8e62', email: 'traveler@example.com', role: UserRole.TRAVELER, isActive: true });
    bookingAgentToken = jwtService.sign({ sub: 'a0123e4b-6e21-4d1a-8c10-9c2f5d7b5f10', email: 'agent@trust-travel.com', role: UserRole.BOOKING_AGENT, isActive: true });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/hotels/search (GET)', () => {
    it('should return mock search results without auth', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/hotels/search?city=Makkah&checkIn=2026-07-01&checkOut=2026-07-03&guests=2')
        .expect(200);

      expect(Array.isArray(response.body.data.results)).toBe(true);
    });
  });

  describe('/hotels/:hotelId (GET)', () => {
    it('should return hotel details and reviews', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/hotels/HTL-MAK-001')
        .expect(200);

      expect(response.body.data.name).toBeDefined();
    });
  });

  describe('/hotels/:hotelId/rooms/:roomId/availability (GET)', () => {
    it('should return room availability', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/hotels/HTL-MAK-001/rooms/ROOM-MAK-001/availability?checkIn=2026-07-01&checkOut=2026-07-03')
        .expect(200);

      expect(response.body.data.available).toBe(true);
    });
  });

  describe('/hotels/book (POST)', () => {
    it('should book a hotel room successfully for a traveler', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/hotels/book')
        .set('Authorization', `Bearer ${travelerToken}`)
        .send({
          hotelId: 'HTL-MAK-001',
          roomId: 'ROOM-MAK-001',
          checkIn: '2026-07-01',
          checkOut: '2026-07-03',
          guestCount: 2,
        })
        .expect(201);

      expect(response.body.data.paymentUrl).toBeDefined();
    });

    it('should deny booking if not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/hotels/book')
        .send({
          hotelId: 'HTL-MAK-001',
          roomId: 'ROOM-MAK-001',
          checkIn: '2026-07-01',
          checkOut: '2026-07-03',
          guestCount: 2,
        })
        .expect(401);
    });
  });
});
