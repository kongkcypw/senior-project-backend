import { ConfigService as NestConfigService } from '@nestjs/config';
import { BaseConfigService } from './base-config.service';

class TestConfigService extends BaseConfigService<string> {
    constructor(nest: NestConfigService) { super(nest); }
    callGetAsString(key: string): string { return this.getAsString(key); }
    callGetAsNumber(key: string): number { return this.getAsNumber(key); }
}

describe('BaseConfigService', () => {
    let nest: jest.Mocked<NestConfigService>;
    let svc: TestConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<NestConfigService>;
        svc = new TestConfigService(nest);
    });

    describe('getAsString', () => {
        it('returns the value when defined and non-empty', () => {
            (nest.get as jest.Mock).mockReturnValue('hello');
            expect(svc.callGetAsString('FOO')).toBe('hello');
        });

        it('throws when undefined', () => {
            (nest.get as jest.Mock).mockReturnValue(undefined);
            expect(() => svc.callGetAsString('FOO')).toThrow('Config key FOO is not defined or empty');
        });

        it('throws when empty string', () => {
            (nest.get as jest.Mock).mockReturnValue('');
            expect(() => svc.callGetAsString('FOO')).toThrow('Config key FOO is not defined or empty');
        });
    });

    describe('getAsNumber', () => {
        it('parses numeric values', () => {
            (nest.get as jest.Mock).mockReturnValue('42');
            expect(svc.callGetAsNumber('NUM')).toBe(42);
        });

        it('throws when value cannot be parsed as number', () => {
            (nest.get as jest.Mock).mockReturnValue('not-a-number');
            expect(() => svc.callGetAsNumber('NUM')).toThrow('Config key NUM cannot be parsed as number');
        });

        it('throws when missing', () => {
            (nest.get as jest.Mock).mockReturnValue(undefined);
            expect(() => svc.callGetAsNumber('NUM')).toThrow('Config key NUM is not defined or empty');
        });
    });
});
