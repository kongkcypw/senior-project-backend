import { GeminiService } from './gemini.service';

const mockGenerateContent = jest.fn();
jest.mock('@google/genai', () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: { generateContent: mockGenerateContent },
    })),
}));

describe('GeminiService', () => {
    let service: GeminiService;

    beforeEach(() => {
        mockGenerateContent.mockReset();
        service = new GeminiService();
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('analyzeFoodImage', () => {
        it('returns success message and data when food', async () => {
            mockGenerateContent.mockResolvedValue({
                text: JSON.stringify({ is_food: true, food_title: 'rice' }),
            });
            const r = await service.analyzeFoodImage(Buffer.from('img'), 'image/jpeg');
            expect(r?.message).toBe('Food analysis successful.');
            expect(r?.data.is_food).toBe(true);
        });

        it('returns analysis_result message when not food', async () => {
            mockGenerateContent.mockResolvedValue({
                text: JSON.stringify({ is_food: false, analysis_result: 'Looks like a chair' }),
            });
            const r = await service.analyzeFoodImage(Buffer.from('img'), 'image/jpeg');
            expect(r?.message).toBe('Looks like a chair');
        });

        it('returns default message when not food and no analysis_result', async () => {
            mockGenerateContent.mockResolvedValue({
                text: JSON.stringify({ is_food: false }),
            });
            const r = await service.analyzeFoodImage(Buffer.from('img'), 'image/jpeg');
            expect(r?.message).toBe('The image does not appear to be food.');
        });

        it('throws when no response text', async () => {
            mockGenerateContent.mockResolvedValue({});
            await expect(service.analyzeFoodImage(Buffer.from('img'), 'image/jpeg'))
                .rejects.toThrow('No response from Gemini model.');
        });

        it('returns null when JSON parse fails', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'not-json' });
            const r = await service.analyzeFoodImage(Buffer.from('img'), 'image/jpeg');
            expect(r).toBeNull();
        });
    });
});
