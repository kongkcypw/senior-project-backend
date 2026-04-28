import { of, throwError } from 'rxjs';
import { LineMessagingApiGroupChatService } from './group-chat.service';

describe('LineMessagingApiGroupChatService', () => {
    let service: LineMessagingApiGroupChatService;
    let httpService: any;
    let configService: any;

    beforeEach(() => {
        httpService = { get: jest.fn(), post: jest.fn() };
        configService = { channelAccessToken: 'TOKEN' };
        service = new LineMessagingApiGroupChatService(httpService, configService);
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('getGroupChatSummary', () => {
        it('returns response data', async () => {
            httpService.get.mockReturnValue(of({ data: { groupId: 'G', groupName: 'X' } }));
            const r = await service.getGroupChatSummary('G');
            expect(r).toEqual({ groupId: 'G', groupName: 'X' });
        });

        it('returns null on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getGroupChatSummary('G');
            expect(r).toBeNull();
        });
    });

    describe('getGroupChatMemberCount', () => {
        it('returns count', async () => {
            httpService.get.mockReturnValue(of({ data: { count: 5 } }));
            const r = await service.getGroupChatMemberCount('G');
            expect(r).toBe(5);
        });

        it('returns null on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getGroupChatMemberCount('G');
            expect(r).toBeNull();
        });
    });

    describe('getGroupChatMemberProfile', () => {
        it('returns response data', async () => {
            httpService.get.mockReturnValue(of({ data: { userId: 'U' } }));
            const r = await service.getGroupChatMemberProfile('G', 'U');
            expect(r).toEqual({ userId: 'U' });
        });

        it('returns null on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getGroupChatMemberProfile('G', 'U');
            expect(r).toBeNull();
        });
    });

    describe('leaveGroupChat', () => {
        it('returns true on success', async () => {
            httpService.post.mockReturnValue(of({ data: {} }));
            const r = await service.leaveGroupChat('G');
            expect(r).toBe(true);
        });

        it('returns false on error', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.leaveGroupChat('G');
            expect(r).toBe(false);
        });
    });
});
