import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
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

  it('/auth/register (POST) - validation failure', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'invalid' })
      .expect(400); // Bad Request due to validation pipe
  });

  // DB-dependent tests are skipped or would require test DB setup
});
