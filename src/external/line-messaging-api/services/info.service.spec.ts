import { of, throwError } from 'rxjs';
import { LineMessagingApiInfoService } from './info.service';

describe('LineMessagingApiInfoService', () => {
    let service: LineMessagingApiInfoService;
    let httpService: any;

    beforeEach(() => {
        httpService = { get: jest.fn() };
        service = new LineMessagingApiInfoService(httpService);
    });

    describe('getBotInfo', () => {
        const mockToken = 'my-channel-access-token';
        const mockBotInfo = {
            userId: 'U123456',
            basicId: '@mybot',
            displayName: 'My Bot',
            chatMode: 'chat',
            markAsReadMode: 'auto',
        };

        it('returns bot info on success', async () => {
            httpService.get.mockReturnValue(of({ data: mockBotInfo }));

            const result = await service.getBotInfo(mockToken);

            expect(result).toEqual(mockBotInfo);
            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('/v2/bot/info'),
                { headers: { Authorization: `Bearer ${mockToken}` } },
            );
        });

        it('passes the provided token in the Authorization header', async () => {
            httpService.get.mockReturnValue(of({ data: mockBotInfo }));

            await service.getBotInfo('custom-token');

            expect(httpService.get).toHaveBeenCalledWith(
                expect.any(String),
                { headers: { Authorization: 'Bearer custom-token' } },
            );
        });

        it('returns null on error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            httpService.get.mockReturnValue(throwError(() => new Error('401 Unauthorized')));

            const result = await service.getBotInfo(mockToken);

            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });

        it('logs the error when the request fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const error = new Error('network error');
            httpService.get.mockReturnValue(throwError(() => error));

            await service.getBotInfo(mockToken);

            expect(consoleSpy).toHaveBeenCalledWith('Error fetching bot info:', error);
            consoleSpy.mockRestore();
        });
    });
});
