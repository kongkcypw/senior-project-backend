import { of, throwError } from 'rxjs';
import { LineMessagingApiMessageContentService } from './message-content.service';

describe('LineMessagingApiMessageContentService', () => {
    let service: LineMessagingApiMessageContentService;
    let httpService: any;
    let configService: any;

    beforeEach(() => {
        httpService = { get: jest.fn() };
        configService = { channelAccessToken: 'TOKEN' };
        service = new LineMessagingApiMessageContentService(httpService, configService);
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('getMessageContent', () => {
        it('returns buffer and content type when present', async () => {
            httpService.get.mockReturnValue(of({
                data: new Uint8Array([1, 2, 3]).buffer,
                headers: { 'content-type': 'image/jpeg' },
            }));
            const r = await service.getMessageContent('M1');
            expect(r?.contentType).toBe('image/jpeg');
            expect(r?.buffer).toBeInstanceOf(Buffer);
        });

        it('returns null when content-type is missing', async () => {
            httpService.get.mockReturnValue(of({
                data: new Uint8Array([1]).buffer,
                headers: {},
            }));
            const r = await service.getMessageContent('M1');
            expect(r).toBeNull();
        });

        it('returns null on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getMessageContent('M1');
            expect(r).toBeNull();
        });
    });
});
