import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /flights/search', () => {
    it('should return 400 for missing required params', () => {
      return request(app.getHttpServer())
        .get('/flights/search')
        .expect(400);
    });

    it('should search flights with valid params (public endpoint)', () => {
      return request(app.getHttpServer())
        .get('/flights/search')
        .query({
          origin: 'RUH',
          destination: 'IST',
          departureDate: '2026-06-15',
          passengers: 1,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('results');
          expect(res.body.data).toHaveProperty('meta');
        });
    });
  });

  describe('POST /flights/compare', () => {
    it('should return 400 for fewer than 2 flight IDs', () => {
      return request(app.getHttpServer())
        .post('/flights/compare')
        .send({ flightIds: ['only-one-id'] })
        .expect(400);
    });

    it('should compare flights (public endpoint)', () => {
      return request(app.getHttpServer())
        .post('/flights/compare')
        .send({ flightIds: ['mock-fl-001', 'mock-fl-002'] })
        .expect(200);
    });
  });

  describe('POST /flights/book (auth required)', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .post('/flights/book')
        .send({
          flightId: 'mock-fl-001',
          passengers: [],
          contactEmail: 'test@example.com',
        })
        .expect(401);
    });
  });

  describe('GET /flights/:id (auth required)', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .get('/flights/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });
  });

  describe('GET /flights (auth required)', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .expect(401);
    });
  });

  describe('PATCH /flights/:id/cancel (auth required)', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .patch('/flights/00000000-0000-0000-0000-000000000000/cancel')
        .send({ reason: 'Changed plans' })
        .expect(401);
    });
  });
});
