import { FallbackIntentService } from './fallback-intent.service';
import { FeatureRateLimitKey } from 'src/feature-rate-limit/enums/feature-rate-limit.enum';

describe('FallbackIntentService', () => {
    let service: FallbackIntentService;
    let ragAgentService: any;
    let lineMessagingApiClientService: any;
    let userService: any;
    let featureRateLimitService: any;

    beforeEach(() => {
        ragAgentService = { getRAGResponse: jest.fn() };
        lineMessagingApiClientService = { sendReplyMessages: jest.fn() };
        userService = { findByLineUserId: jest.fn() };
        featureRateLimitService = { incrementUsage: jest.fn() };
        service = new FallbackIntentService(
            ragAgentService,
            lineMessagingApiClientService,
            userService,
            featureRateLimitService,
        );
    });

    const buildEvent = (userId: string | null) => ({
        replyToken: 'token',
        source: { userId, type: 'user' as const },
    } as any);

    describe('handleFallbackIntent', () => {
        it('does nothing when userId missing', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await service.handleFallbackIntent('hi', buildEvent(null));
            expect(userService.findByLineUserId).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('does nothing when user has no role', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            userService.findByLineUserId.mockResolvedValue({ role: null });
            await service.handleFallbackIntent('hi', buildEvent('U1'));
            expect(ragAgentService.getRAGResponse).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('sends reply with RAG response and increments usage when gemini calls used', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            userService.findByLineUserId.mockResolvedValue({ role: 'Trainee' });
            ragAgentService.getRAGResponse.mockResolvedValue({ message: 'Hi!', gemini_call_count: 2 });
            await service.handleFallbackIntent('hi', buildEvent('U1'));
            expect(featureRateLimitService.incrementUsage).toHaveBeenCalledWith(FeatureRateLimitKey.RAG_LLM_SERVICE, 2);
            expect(lineMessagingApiClientService.sendReplyMessages).toHaveBeenCalledWith('token', [
                { type: 'text', text: 'Hi!' },
            ]);
            consoleSpy.mockRestore();
        });

        it('does not increment usage when gemini_call_count is 0', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            userService.findByLineUserId.mockResolvedValue({ role: 'Trainee' });
            ragAgentService.getRAGResponse.mockResolvedValue({ message: 'Hi!', gemini_call_count: 0 });
            await service.handleFallbackIntent('hi', buildEvent('U1'));
            expect(featureRateLimitService.incrementUsage).not.toHaveBeenCalled();
            expect(lineMessagingApiClientService.sendReplyMessages).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
