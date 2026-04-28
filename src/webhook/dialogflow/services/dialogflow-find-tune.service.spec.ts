import { DialogflowFindTuneService } from './dialogflow-find-tune.service';

describe('DialogflowFindTuneService', () => {
    let service: DialogflowFindTuneService;
    let dialogflowClientService: any;
    let dialogflowConfigService: any;
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            projectAgentSessionPath: jest.fn().mockReturnValue('sessions/path'),
            detectIntent: jest.fn(),
        };
        dialogflowClientService = {
            createSessionsClient: jest.fn().mockReturnValue(mockClient),
        };
        dialogflowConfigService = { projectId: 'project-id' };
        service = new DialogflowFindTuneService(dialogflowClientService, dialogflowConfigService);
    });

    describe('getDialogflowIntentAndConfidence', () => {
        it('returns intent name and confidence when intent detected', async () => {
            mockClient.detectIntent.mockResolvedValue([{
                queryResult: {
                    intent: { displayName: 'IntentA' },
                    intentDetectionConfidence: 0.85,
                },
            }]);
            const r = await service.getDialogflowIntentAndConfidence('hi');
            expect(r).toEqual({ intentName: 'IntentA', intentDetectionConfidence: 0.85 });
        });

        it('returns null when no intent', async () => {
            mockClient.detectIntent.mockResolvedValue([{ queryResult: { intent: null } }]);
            const r = await service.getDialogflowIntentAndConfidence('hi');
            expect(r).toBeNull();
        });

        it('returns null when no result', async () => {
            mockClient.detectIntent.mockResolvedValue([{ queryResult: null }]);
            const r = await service.getDialogflowIntentAndConfidence('hi');
            expect(r).toBeNull();
        });

        it('returns undefined when an error is thrown', async () => {
            mockClient.detectIntent.mockRejectedValue(new Error('fail'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const r = await service.getDialogflowIntentAndConfidence('hi');
            expect(r).toBeUndefined();
            consoleSpy.mockRestore();
        });
    });
});
