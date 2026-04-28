import { ConfigService } from '@nestjs/config';
import { LineLiffConfigService } from './config.service';

describe('LineLiffConfigService', () => {
    let nest: jest.Mocked<ConfigService>;
    let svc: LineLiffConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;
        svc = new LineLiffConfigService(nest);
    });

    it('reads liffId', () => {
        (nest.get as jest.Mock).mockReturnValue('liffid');
        expect(svc.liffId).toBe('liffid');
        expect(nest.get).toHaveBeenCalledWith('LIFF_ID');
    });

    it('reads liffNumericId', () => {
        (nest.get as jest.Mock).mockReturnValue('123');
        expect(svc.liffNumericId).toBe('123');
        expect(nest.get).toHaveBeenCalledWith('LIFF_NUMERIC_ID');
    });

    it('throws when missing', () => {
        (nest.get as jest.Mock).mockReturnValue(undefined);
        expect(() => svc.liffId).toThrow();
    });
});
