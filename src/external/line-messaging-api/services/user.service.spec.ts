import { of, throwError } from 'rxjs';
import { LineMessagingApiUserService } from './user.service';

describe('LineMessagingApiUserService', () => {
    let service: LineMessagingApiUserService;
    let httpService: any;
    let configService: any;

    beforeEach(() => {
        httpService = { get: jest.fn() };
        configService = { channelAccessToken: 'TOKEN' };
        service = new LineMessagingApiUserService(httpService, configService);
    });

    describe('getProfile', () => {
        it('returns the response data on success', async () => {
            httpService.get.mockReturnValue(of({ data: { displayName: 'A', userId: 'U1' } }));
            const r = await service.getProfile('U1');
            expect(r).toEqual({ displayName: 'A', userId: 'U1' });
            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('/v2/bot/profile/U1'),
                { headers: { Authorization: 'Bearer TOKEN' } },
            );
        });

        it('returns null on error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            httpService.get.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getProfile('U1');
            expect(r).toBeNull();
            consoleSpy.mockRestore();
        });
    });
});
