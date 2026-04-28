import { DialogflowWebhookService } from './dialogflow-webhook.service';

describe('DialogflowWebhookService', () => {
    let service: DialogflowWebhookService;
    let dialogflowClientService: any;
    let dialogflowConfigService: any;
    let dialogflowWebhookGroupChatHandler: any;
    let dialogflowWebhookPersonalChatHandler: any;
    let fallbackIntentService: any;
    let featureFlagService: any;
    let featureDisableHandler: any;
    let featureRateLimitService: any;
    let featureReachRateLimitHandler: any;
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            projectAgentSessionPath: jest.fn().mockReturnValue('sessions/path'),
            detectIntent: jest.fn(),
        };
        dialogflowClientService = { createSessionsClient: jest.fn().mockReturnValue(mockClient) };
        dialogflowConfigService = { projectId: 'pid' };
        dialogflowWebhookGroupChatHandler = { handleIntent: jest.fn() };
        dialogflowWebhookPersonalChatHandler = { handleIntent: jest.fn() };
        fallbackIntentService = { handleFallbackIntent: jest.fn() };
        featureFlagService = { isEnabled: jest.fn() };
        featureDisableHandler = { handleGeneral: jest.fn() };
        featureRateLimitService = { isLimitReached: jest.fn() };
        featureReachRateLimitHandler = { handleGeneral: jest.fn() };

        service = new DialogflowWebhookService(
            dialogflowClientService,
            dialogflowConfigService,
            dialogflowWebhookGroupChatHandler,
            dialogflowWebhookPersonalChatHandler,
            fallbackIntentService,
            featureFlagService,
            featureDisableHandler,
            featureRateLimitService,
            featureReachRateLimitHandler,
        );
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const buildEvent = (text: string | null) => ({
        replyToken: 'token',
        source: { userId: 'U1', type: 'user' },
        message: text === null ? { type: 'image' } : { type: 'text', text },
    }) as any;

    describe('getFullfilmentTextAndReplyMessage', () => {
        it('returns early when message is not text', async () => {
            await service.getFullfilmentTextAndReplyMessage(buildEvent(null), false);
            expect(dialogflowClientService.createSessionsClient).not.toHaveBeenCalled();
        });

        it('routes to personal chat handler on confident intent in non-group chat', async () => {
            mockClient.detectIntent.mockResolvedValue([{
                queryResult: {
                    intent: { displayName: 'IntentA' },
                    intentDetectionConfidence: 0.9,
                    fulfillmentMessages: [],
                    parameters: { fields: {} },
                },
            }]);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(dialogflowWebhookPersonalChatHandler.handleIntent).toHaveBeenCalled();
        });

        it('routes to group handler on confident intent in group chat', async () => {
            mockClient.detectIntent.mockResolvedValue([{
                queryResult: {
                    intent: { displayName: 'IntentA' },
                    intentDetectionConfidence: 0.9,
                    fulfillmentMessages: [],
                },
            }]);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), true);
            expect(dialogflowWebhookGroupChatHandler.handleIntent).toHaveBeenCalled();
        });

        it('falls back when no result returned', async () => {
            mockClient.detectIntent.mockResolvedValue([{ queryResult: null }]);
            featureFlagService.isEnabled.mockResolvedValue(true);
            featureRateLimitService.isLimitReached.mockResolvedValue(false);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(fallbackIntentService.handleFallbackIntent).toHaveBeenCalledWith('hi', expect.anything());
        });

        it('falls back when intent is Default Fallback Intent', async () => {
            mockClient.detectIntent.mockResolvedValue([{
                queryResult: {
                    intent: { displayName: 'Default Fallback Intent' },
                    intentDetectionConfidence: 1,
                },
            }]);
            featureFlagService.isEnabled.mockResolvedValue(true);
            featureRateLimitService.isLimitReached.mockResolvedValue(false);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(fallbackIntentService.handleFallbackIntent).toHaveBeenCalled();
        });

        it('falls back when confidence below threshold', async () => {
            mockClient.detectIntent.mockResolvedValue([{
                queryResult: {
                    intent: { displayName: 'IntentA' },
                    intentDetectionConfidence: 0.3,
                },
            }]);
            featureFlagService.isEnabled.mockResolvedValue(true);
            featureRateLimitService.isLimitReached.mockResolvedValue(false);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(fallbackIntentService.handleFallbackIntent).toHaveBeenCalled();
        });

        it('uses feature-disable handler when RAG flag disabled', async () => {
            mockClient.detectIntent.mockResolvedValue([{ queryResult: null }]);
            featureFlagService.isEnabled.mockResolvedValue(false);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(featureDisableHandler.handleGeneral).toHaveBeenCalled();
            expect(fallbackIntentService.handleFallbackIntent).not.toHaveBeenCalled();
        });

        it('uses rate-limit handler when limit reached', async () => {
            mockClient.detectIntent.mockResolvedValue([{ queryResult: null }]);
            featureFlagService.isEnabled.mockResolvedValue(true);
            featureRateLimitService.isLimitReached.mockResolvedValue(true);
            await service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false);
            expect(featureReachRateLimitHandler.handleGeneral).toHaveBeenCalled();
            expect(fallbackIntentService.handleFallbackIntent).not.toHaveBeenCalled();
        });

        it('swallows errors thrown by Dialogflow client', async () => {
            mockClient.detectIntent.mockRejectedValue(new Error('boom'));
            await expect(service.getFullfilmentTextAndReplyMessage(buildEvent('hi'), false))
                .resolves.toBeUndefined();
        });
    });
});
