import { ConfigService } from '@nestjs/config';
import { RagApiConfigService } from './config.service';

describe('RagApiConfigService', () => {
    let nest: jest.Mocked<ConfigService>;
    let svc: RagApiConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;
        svc = new RagApiConfigService(nest);
    });

    it('reads ragApiUrl', () => {
        (nest.get as jest.Mock).mockReturnValue('http://rag');
        expect(svc.ragApiUrl).toBe('http://rag');
        expect(nest.get).toHaveBeenCalledWith('RAG_API_URL');
    });

    it('throws when missing', () => {
        (nest.get as jest.Mock).mockReturnValue(undefined);
        expect(() => svc.ragApiUrl).toThrow();
    });
});
