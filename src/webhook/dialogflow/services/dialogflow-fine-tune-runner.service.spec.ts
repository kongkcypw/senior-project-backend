import { DialogflowFineTuneRunnerService } from './dialogflow-fine-tune-runner.service';

jest.mock('../constants/intent-dataset', () => ({
    IntentDataset: [
        { queryInputText: 'q1', expectedIntentName: 'IntentA' },
        { queryInputText: 'q2', expectedIntentName: 'IntentB' },
        { queryInputText: 'q3', expectedIntentName: 'Default Fallback Intent' },
    ],
}));

describe('DialogflowFineTuneRunnerService', () => {
    let service: DialogflowFineTuneRunnerService;
    let dialogflowFindTuneService: any;

    beforeEach(() => {
        dialogflowFindTuneService = {
            getDialogflowIntentAndConfidence: jest.fn(),
        };
        service = new DialogflowFineTuneRunnerService(dialogflowFindTuneService);
    });

    describe('fetchRawResults', () => {
        it('calls Dialogflow once per dataset entry and maps responses', async () => {
            dialogflowFindTuneService.getDialogflowIntentAndConfidence
                .mockResolvedValueOnce({ intentName: 'IntentA', intentDetectionConfidence: 0.9 })
                .mockResolvedValueOnce({ intentName: 'IntentB', intentDetectionConfidence: 0.5 })
                .mockResolvedValueOnce(null);

            const r = await service.fetchRawResults();
            expect(dialogflowFindTuneService.getDialogflowIntentAndConfidence).toHaveBeenCalledTimes(3);
            expect(r).toEqual([
                { queryInputText: 'q1', expectedIntentName: 'IntentA', rawIntentName: 'IntentA', confidence: 0.9 },
                { queryInputText: 'q2', expectedIntentName: 'IntentB', rawIntentName: 'IntentB', confidence: 0.5 },
                { queryInputText: 'q3', expectedIntentName: 'Default Fallback Intent', rawIntentName: null, confidence: null },
            ]);
        });
    });

    describe('runAll', () => {
        it('returns summary with passRate and per-intent breakdown', async () => {
            dialogflowFindTuneService.getDialogflowIntentAndConfidence
                .mockResolvedValueOnce({ intentName: 'IntentA', intentDetectionConfidence: 0.9 })
                .mockResolvedValueOnce({ intentName: 'IntentB', intentDetectionConfidence: 0.3 })
                .mockResolvedValueOnce(null);

            const summary = await service.runAll(0.5);
            expect(summary.threshold).toBe(0.5);
            expect(summary.total).toBe(3);
            // q1 passes (0.9 >= 0.5 and matches IntentA)
            // q2 falls back (0.3 < 0.5) — actual becomes Default Fallback Intent ≠ IntentB → fail
            // q3 has null → falls back → matches Default Fallback Intent → pass
            expect(summary.passed).toBe(2);
            expect(summary.failed).toBe(1);
            expect(summary.byIntent['IntentA'].passed).toBe(1);
            expect(summary.byIntent['IntentB'].failed).toBe(1);
            expect(summary.byIntent['Default Fallback Intent'].passed).toBe(1);
        });
    });

    describe('runSweep', () => {
        it('runs across thresholds and identifies best', async () => {
            dialogflowFindTuneService.getDialogflowIntentAndConfidence
                .mockResolvedValueOnce({ intentName: 'IntentA', intentDetectionConfidence: 0.9 })
                .mockResolvedValueOnce({ intentName: 'IntentB', intentDetectionConfidence: 0.5 })
                .mockResolvedValueOnce(null);

            const summary = await service.runSweep(0.4, 0.6, 0.1);
            expect(summary.from).toBe(0.4);
            expect(summary.to).toBe(0.6);
            expect(summary.step).toBe(0.1);
            expect(summary.sweep.length).toBeGreaterThan(0);
            expect(typeof summary.bestThreshold).toBe('number');
            expect(typeof summary.bestPassRate).toBe('number');
            // dataset is fetched once, not threshold-times
            expect(dialogflowFindTuneService.getDialogflowIntentAndConfidence).toHaveBeenCalledTimes(3);
        });
    });

    describe('sweepToCsv', () => {
        it('emits header and rows including OVERALL per threshold', () => {
            const summary: any = {
                from: 0, to: 1, step: 0.5,
                bestThreshold: 0, bestPassRate: 0,
                sweep: [
                    {
                        threshold: 0.5,
                        total: 2, passed: 1, failed: 1, passRate: 50,
                        byIntent: { IntentA: { total: 1, passed: 1, failed: 0, passRate: 100 } },
                    },
                ],
            };
            const csv = service.sweepToCsv(summary);
            const lines = csv.split('\n');
            expect(lines[0]).toBe('threshold,intentName,total,passed,failed,passRate,isOverall');
            expect(lines).toContain('0.5,IntentA,1,1,0,100,false');
            expect(lines).toContain('0.5,OVERALL,2,1,1,50,true');
        });
    });
});
