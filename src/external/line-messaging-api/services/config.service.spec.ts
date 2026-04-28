import { ConfigService } from '@nestjs/config';
import { LineMessagingApiConfigService } from './config.service';

describe('LineMessagingApiConfigService', () => {
    let nest: jest.Mocked<ConfigService>;
    let svc: LineMessagingApiConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;
        svc = new LineMessagingApiConfigService(nest);
    });

    it('reads channelSecret', () => {
        (nest.get as jest.Mock).mockReturnValue('secret');
        expect(svc.channelSecret).toBe('secret');
        expect(nest.get).toHaveBeenCalledWith('LINE_CHANNEL_SECRET');
    });

    it('reads channelAccessToken', () => {
        (nest.get as jest.Mock).mockReturnValue('token');
        expect(svc.channelAccessToken).toBe('token');
        expect(nest.get).toHaveBeenCalledWith('LINE_CHANNEL_ACCESS_TOKEN');
    });

    it('reads chatbotUserId', () => {
        (nest.get as jest.Mock).mockReturnValue('uid');
        expect(svc.chatbotUserId).toBe('uid');
        expect(nest.get).toHaveBeenCalledWith('LINE_CHATBOT_USER_ID');
    });

    it('reads chatbotDashboardId', () => {
        (nest.get as jest.Mock).mockReturnValue('did');
        expect(svc.chatbotDashboardId).toBe('did');
        expect(nest.get).toHaveBeenCalledWith('LINE_CHATBOT_DASHBOARD_ID');
    });

    it('throws when value is empty', () => {
        (nest.get as jest.Mock).mockReturnValue('');
        expect(() => svc.channelSecret).toThrow();
    });
});
