import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle a signup request', () => {

    const newUser = { email: 'asdqwe11@test.com', password: '1234'}
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(newUser.email)
      })
  });

  it('should get logged in user after a successfull signup', async () => {
    const newUser = { email: 'asdqwe11@test.com', password: '1234'}
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201)

    const cookie = res.get('Set-Cookie') as string[]
    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.email).toEqual(newUser.email)
  })

  afterEach(async () => {
    await app.close();
  });
});
