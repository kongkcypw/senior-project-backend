import { LineMessagingApiClientService } from './client.service';
import { HTTPFetchError, messagingApi } from '@line/bot-sdk';

const mockClient = {
    replyMessage: jest.fn(),
    pushMessage: jest.fn(),
    linkRichMenuIdToUser: jest.fn(),
    unlinkRichMenuIdFromUser: jest.fn(),
};

jest.mock('@line/bot-sdk', () => {
    const actual = jest.requireActual('@line/bot-sdk');
    return {
        ...actual,
        messagingApi: {
            ...actual.messagingApi,
            MessagingApiClient: jest.fn().mockImplementation(() => mockClient),
        },
    };
});

describe('LineMessagingApiClientService', () => {
    let service: LineMessagingApiClientService;
    let configService: any;

    beforeEach(() => {
        configService = { channelAccessToken: 'TOKEN' };
        service = new LineMessagingApiClientService(configService);
        Object.values(mockClient).forEach((fn) => (fn as jest.Mock).mockReset());
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    const buildHttpClientError = (status: number) => {
        const err = new HTTPFetchError('error', { status, headers: new Headers(), body: 'body' });
        return err;
    };

    describe('sendReplyMessages', () => {
        it('delegates to client.replyMessage', async () => {
            mockClient.replyMessage.mockResolvedValue(undefined);
            await service.sendReplyMessages('token', [{ type: 'text', text: 'hi' }]);
            expect(mockClient.replyMessage).toHaveBeenCalledWith({
                replyToken: 'token',
                messages: [{ type: 'text', text: 'hi' }],
            });
        });

        it('swallows http client errors (4xx)', async () => {
            mockClient.replyMessage.mockRejectedValue(buildHttpClientError(400));
            await expect(service.sendReplyMessages('token', [])).resolves.toBeUndefined();
        });

        it('rethrows non-client errors', async () => {
            mockClient.replyMessage.mockRejectedValue(new Error('not a client error'));
            await expect(service.sendReplyMessages('token', [])).rejects.toThrow('not a client error');
        });
    });

    describe('sendPushMessages', () => {
        it('delegates to client.pushMessage', async () => {
            mockClient.pushMessage.mockResolvedValue(undefined);
            await service.sendPushMessages('U1', [{ type: 'text', text: 'hi' }]);
            expect(mockClient.pushMessage).toHaveBeenCalledWith({
                to: 'U1',
                messages: [{ type: 'text', text: 'hi' }],
            });
        });

        it('swallows http client errors', async () => {
            mockClient.pushMessage.mockRejectedValue(buildHttpClientError(404));
            await expect(service.sendPushMessages('U1', [])).resolves.toBeUndefined();
        });

        it('rethrows non-client errors', async () => {
            mockClient.pushMessage.mockRejectedValue(new Error('boom'));
            await expect(service.sendPushMessages('U1', [])).rejects.toThrow('boom');
        });
    });

    describe('linkRichMenuIdToUser', () => {
        it('delegates to client', async () => {
            mockClient.linkRichMenuIdToUser.mockResolvedValue(undefined);
            await service.linkRichMenuIdToUser('U1', 'rich1');
            expect(mockClient.linkRichMenuIdToUser).toHaveBeenCalledWith('U1', 'rich1');
        });

        it('swallows client errors and rethrows others', async () => {
            mockClient.linkRichMenuIdToUser.mockRejectedValueOnce(buildHttpClientError(400));
            await expect(service.linkRichMenuIdToUser('U1', 'r')).resolves.toBeUndefined();
            mockClient.linkRichMenuIdToUser.mockRejectedValueOnce(new Error('x'));
            await expect(service.linkRichMenuIdToUser('U1', 'r')).rejects.toThrow('x');
        });
    });

    describe('unlinkRichMenuIdFromUser', () => {
        it('delegates to client', async () => {
            mockClient.unlinkRichMenuIdFromUser.mockResolvedValue(undefined);
            await service.unlinkRichMenuIdFromUser('U1');
            expect(mockClient.unlinkRichMenuIdFromUser).toHaveBeenCalledWith('U1');
        });

        it('swallows client errors and rethrows others', async () => {
            mockClient.unlinkRichMenuIdFromUser.mockRejectedValueOnce(buildHttpClientError(400));
            await expect(service.unlinkRichMenuIdFromUser('U1')).resolves.toBeUndefined();
            mockClient.unlinkRichMenuIdFromUser.mockRejectedValueOnce(new Error('x'));
            await expect(service.unlinkRichMenuIdFromUser('U1')).rejects.toThrow('x');
        });
    });
});
