import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { LineWebhookController } from 'src/webhook/line/controllers/line-webhook.controller';
import { LineWebhookService } from 'src/webhook/line/services/line-webhook.service';

/**
 * The LINE webhook endpoint has no auth guards — any POST is accepted.
 * The service swallows internal errors, so the controller always aims to return 200.
 * We mock the service to isolate controller routing and status-code behaviour.
 */
describe('LineWebhookController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<LineWebhookService, 'handleWebhookEvent'>>;

    const webhookBody = {
        destination: 'U_BOT_001',
        events: [
            {
                type: 'message',
                timestamp: 1704067200000,
                source: { type: 'user', userId: 'U_TRAINEE_001' },
                replyToken: 'reply_token_001',
                message: { type: 'text', id: 'msg_001', text: 'Hello' },
            },
        ],
    };

    beforeAll(async () => {
        mockService = {
            handleWebhookEvent: jest.fn(),
        };

        // No auth guards on this controller — no overrideGuard needed
        const moduleRef = await Test.createTestingModule({
            controllers: [LineWebhookController],
            providers: [{ provide: LineWebhookService, useValue: mockService }],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useLogger(false);
        await app.init();
    });

    afterAll(() => app.close());

    describe('POST /webhook/line', () => {
        it('200 - processes webhook event and returns 200', async () => {
            mockService.handleWebhookEvent.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .post('/webhook/line')
                .set('x-line-signature', 'valid_signature')
                .send(webhookBody)
                .expect(200);

            expect(mockService.handleWebhookEvent).toHaveBeenCalledWith(
                webhookBody,
                'valid_signature',
            );
        });

        it('500 - returns 500 when service throws an unhandled error', async () => {
            mockService.handleWebhookEvent.mockRejectedValue(new Error('Unexpected failure'));

            await request(app.getHttpServer())
                .post('/webhook/line')
                .set('x-line-signature', 'valid_signature')
                .send(webhookBody)
                .expect(500);
        });
    });
});
