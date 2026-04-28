import { ConfigService } from '@nestjs/config';
import { DialogflowConfigService } from './config.service';

describe('DialogflowConfigService', () => {
    let nest: jest.Mocked<ConfigService>;
    let svc: DialogflowConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;
        svc = new DialogflowConfigService(nest);
    });

    it('reads projectId', () => {
        (nest.get as jest.Mock).mockReturnValue('pid');
        expect(svc.projectId).toBe('pid');
    });

    it('reads clientEmail', () => {
        (nest.get as jest.Mock).mockReturnValue('a@b.com');
        expect(svc.clientEmail).toBe('a@b.com');
    });

    it('decodes \\n escape sequences in privateKey', () => {
        (nest.get as jest.Mock).mockReturnValue('-----BEGIN-----\\nKEY\\n-----END-----');
        expect(svc.privateKey).toBe('-----BEGIN-----\nKEY\n-----END-----');
    });

    it('throws when value missing', () => {
        (nest.get as jest.Mock).mockReturnValue(undefined);
        expect(() => svc.projectId).toThrow();
    });
});
