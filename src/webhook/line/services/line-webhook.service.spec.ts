import { LineWebhookService } from './line-webhook.service';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

describe('LineWebhookService', () => {
    let service: LineWebhookService;
    let messageEventHandler: any;
    let joinEventHandler: any;
    let leaveEventHandler: any;
    let memberJoinedEventHandler: any;
    let memberLeaveEventHandler: any;
    let postbackEventHandler: any;
    let followEventHandler: any;

    beforeEach(() => {
        messageEventHandler = { handle: jest.fn() };
        joinEventHandler = { handle: jest.fn() };
        leaveEventHandler = { handle: jest.fn() };
        memberJoinedEventHandler = { handle: jest.fn() };
        memberLeaveEventHandler = { handle: jest.fn() };
        postbackEventHandler = { handle: jest.fn() };
        followEventHandler = { handle: jest.fn() };

        service = new LineWebhookService(
            messageEventHandler,
            joinEventHandler,
            leaveEventHandler,
            memberJoinedEventHandler,
            memberLeaveEventHandler,
            postbackEventHandler,
            followEventHandler,
        );
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('handleWebhookEvent', () => {
        it('processes events and swallows errors', async () => {
            const body: any = { events: [{ type: WebhookEventType.MESSAGE }], destination: 'D1' };
            await service.handleWebhookEvent(body, 'sig');
            expect(messageEventHandler.handle).toHaveBeenCalled();
        });

        it('catches thrown errors', async () => {
            messageEventHandler.handle.mockRejectedValue(new Error('boom'));
            const body: any = { events: [{ type: WebhookEventType.MESSAGE }], destination: 'D1' };
            await expect(service.handleWebhookEvent(body, 'sig')).resolves.toBeUndefined();
        });
    });

    describe('processEvents', () => {
        it('handles all events in parallel', async () => {
            const events: any[] = [
                { type: WebhookEventType.MESSAGE },
                { type: WebhookEventType.JOIN },
            ];
            await service.processEvents(events, 'D1');
            expect(messageEventHandler.handle).toHaveBeenCalled();
            expect(joinEventHandler.handle).toHaveBeenCalled();
        });
    });

    describe('handleEvent', () => {
        it.each([
            [WebhookEventType.MESSAGE, 'messageEventHandler'],
            [WebhookEventType.POSTBACK, 'postbackEventHandler'],
            [WebhookEventType.JOIN, 'joinEventHandler'],
            [WebhookEventType.LEAVE, 'leaveEventHandler'],
            [WebhookEventType.MEMBER_JOINED, 'memberJoinedEventHandler'],
            [WebhookEventType.MEMBER_LEAVED, 'memberLeaveEventHandler'],
        ])('routes %s to the correct handler', async (type, handlerName) => {
            await service.handleEvent({ type } as any, 'D1');
            const handlers: Record<string, any> = {
                messageEventHandler,
                postbackEventHandler,
                joinEventHandler,
                leaveEventHandler,
                memberJoinedEventHandler,
                memberLeaveEventHandler,
            };
            expect(handlers[handlerName].handle).toHaveBeenCalled();
        });

        it('passes destination to follow handler', async () => {
            await service.handleEvent({ type: WebhookEventType.FOLLOW } as any, 'D1');
            expect(followEventHandler.handle).toHaveBeenCalledWith({ type: WebhookEventType.FOLLOW }, 'D1');
        });

        it('logs unhandled types', async () => {
            await service.handleEvent({ type: 'unknown' } as any, 'D1');
            expect(messageEventHandler.handle).not.toHaveBeenCalled();
        });

        it('catches handler errors', async () => {
            messageEventHandler.handle.mockRejectedValue(new Error('x'));
            await expect(service.handleEvent({ type: WebhookEventType.MESSAGE } as any, 'D1'))
                .resolves.toBeUndefined();
        });
    });
});
