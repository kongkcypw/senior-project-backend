import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagKey } from '../enums/feature-flag.constant';

describe('FeatureFlagService', () => {
    let service: FeatureFlagService;
    let repo: any;

    beforeEach(() => {
        repo = { findByKey: jest.fn() };
        service = new FeatureFlagService(repo);
    });

    describe('isEnabled', () => {
        it('returns false when flag missing', async () => {
            repo.findByKey.mockResolvedValue(null);
            const r = await service.isEnabled(FeatureFlagKey.RAG_LLM_SERVICE);
            expect(r).toBe(false);
        });

        it('returns flag.isEnable value when present', async () => {
            repo.findByKey.mockResolvedValue({ isEnable: true });
            const r = await service.isEnabled(FeatureFlagKey.RAG_LLM_SERVICE);
            expect(r).toBe(true);
        });

        it('returns false when isEnable is false', async () => {
            repo.findByKey.mockResolvedValue({ isEnable: false });
            const r = await service.isEnabled(FeatureFlagKey.RAG_LLM_SERVICE);
            expect(r).toBe(false);
        });
    });
});
