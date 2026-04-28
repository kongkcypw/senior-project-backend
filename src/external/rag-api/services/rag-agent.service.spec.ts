import { of, throwError } from 'rxjs';
import { RagAgentService } from './rag-agent.service';

describe('RagAgentService', () => {
    let service: RagAgentService;
    let httpService: any;
    let configService: any;

    beforeEach(() => {
        httpService = { post: jest.fn() };
        configService = { ragApiUrl: 'http://rag' };
        service = new RagAgentService(configService, httpService);
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('getRAGResponse', () => {
        it('returns mapped message and gemini_call_count', async () => {
            httpService.post.mockReturnValue(of({
                data: { response: 'hello', gemini_call_count: 3 },
            }));
            const r = await service.getRAGResponse('msg', 'U1', 'Trainee');
            expect(r).toEqual({ message: 'hello', gemini_call_count: 3 });
            expect(httpService.post).toHaveBeenCalledWith('http://rag/agent', {
                message: 'msg',
                line_user_id: 'U1',
                user_role: 'Trainee',
            });
        });

        it('returns fallback message and 0 count on error', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('boom')));
            const r = await service.getRAGResponse('msg', 'U1', 'Trainee');
            expect(r.gemini_call_count).toBe(0);
            expect(r.message).toContain('ขออภัย');
        });
    });
});
