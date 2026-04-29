import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { buildTestApp } from './helpers/create-test-module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    const mockDataSource = {
        query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };

    beforeAll(async () => {
        app = await buildTestApp({
            controllers: [AppController],
            providers: [
                AppService,
                { provide: DataSource, useValue: mockDataSource },
            ],
        });
    });

    afterAll(() => app.close());

    describe('GET /', () => {
        it('200 - returns hello world string', async () => {
            await request(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect('Hello World!');
        });
    });

    describe('GET /health', () => {
        it('200 - returns ok status', async () => {
            await request(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect({ status: 'ok' });
        });
    });

    describe('GET /health/db', () => {
        it('200 - returns ok with latency when DB query succeeds', async () => {
            mockDataSource.query.mockResolvedValue([{ '?column?': 1 }]);

            const res = await request(app.getHttpServer())
                .get('/health/db')
                .expect(200);

            expect(res.body.status).toBe('ok');
            expect(typeof res.body.latencyMs).toBe('number');
        });

        it('500 - returns error when DB query fails', async () => {
            mockDataSource.query.mockRejectedValue(new Error('DB connection failed'));

            await request(app.getHttpServer())
                .get('/health/db')
                .expect(500);
        });
    });
});
