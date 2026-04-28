import { FeatureRateLimitService } from './feature-rate-limit.service';
import { FeatureRateLimitKey } from '../enums/feature-rate-limit.enum';

describe('FeatureRateLimitService', () => {
    let service: FeatureRateLimitService;
    let repo: any;

    beforeEach(() => {
        repo = {
            findByKey: jest.fn(),
            save: jest.fn(),
        };
        service = new FeatureRateLimitService(repo);
    });

    describe('isLimitReached', () => {
        it('returns true when no record exists', async () => {
            repo.findByKey.mockResolvedValue(null);
            const r = await service.isLimitReached(FeatureRateLimitKey.RAG_LLM_SERVICE);
            expect(r).toBe(true);
        });

        it('resets and returns false when last reset is before today', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const record: any = { usagePerDay: 100, maxPerDay: 50, lastResetDate: yesterday };
            repo.findByKey.mockResolvedValue(record);
            const r = await service.isLimitReached(FeatureRateLimitKey.RAG_LLM_SERVICE);
            expect(r).toBe(false);
            expect(record.usagePerDay).toBe(0);
            expect(repo.save).toHaveBeenCalledWith(record);
        });

        it('returns true when usage >= max for today', async () => {
            const record: any = { usagePerDay: 50, maxPerDay: 50, lastResetDate: new Date() };
            repo.findByKey.mockResolvedValue(record);
            const r = await service.isLimitReached(FeatureRateLimitKey.RAG_LLM_SERVICE);
            expect(r).toBe(true);
        });

        it('returns false when usage < max for today', async () => {
            const record: any = { usagePerDay: 5, maxPerDay: 50, lastResetDate: new Date() };
            repo.findByKey.mockResolvedValue(record);
            const r = await service.isLimitReached(FeatureRateLimitKey.RAG_LLM_SERVICE);
            expect(r).toBe(false);
        });
    });

    describe('incrementUsage', () => {
        it('does nothing when record missing', async () => {
            repo.findByKey.mockResolvedValue(null);
            await service.incrementUsage(FeatureRateLimitKey.RAG_LLM_SERVICE, 5);
            expect(repo.save).not.toHaveBeenCalled();
        });

        it('resets usage to count when before today', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const record: any = { usagePerDay: 100, lastResetDate: yesterday };
            repo.findByKey.mockResolvedValue(record);
            await service.incrementUsage(FeatureRateLimitKey.RAG_LLM_SERVICE, 7);
            expect(record.usagePerDay).toBe(7);
            expect(repo.save).toHaveBeenCalled();
        });

        it('adds count to usage when same day', async () => {
            const record: any = { usagePerDay: 5, lastResetDate: new Date() };
            repo.findByKey.mockResolvedValue(record);
            await service.incrementUsage(FeatureRateLimitKey.RAG_LLM_SERVICE, 3);
            expect(record.usagePerDay).toBe(8);
            expect(repo.save).toHaveBeenCalled();
        });

        it('defaults count to 1', async () => {
            const record: any = { usagePerDay: 5, lastResetDate: new Date() };
            repo.findByKey.mockResolvedValue(record);
            await service.incrementUsage(FeatureRateLimitKey.RAG_LLM_SERVICE);
            expect(record.usagePerDay).toBe(6);
        });
    });
});
