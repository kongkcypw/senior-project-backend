import { ConfigService } from '@nestjs/config';
import { CloudFlareConfigService } from './config.service';

describe('CloudFlareConfigService', () => {
    let nest: jest.Mocked<ConfigService>;
    let svc: CloudFlareConfigService;

    beforeEach(() => {
        nest = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;
        svc = new CloudFlareConfigService(nest);
    });

    it.each([
        ['nodeEnv', 'NODE_ENV'],
        ['accountId', 'CLOUDFLARE_R2_ACCOUNT_ID'],
        ['accessKeyId', 'CLOUDFLARE_R2_ACCESS_KEY_ID'],
        ['secretAccessKey', 'CLOUDFLARE_R2_SECRET_ACCESS_KEY'],
        ['bucketName', 'CLOUDFLARE_R2_BUCKET_NAME'],
        ['endpoint', 'CLOUDFLARE_R2_ENDPOINT'],
        ['customDomain', 'CLOUDFLARE_R2_CUSTOM_DOMAIN'],
    ])('reads %s from config key %s', (prop, key) => {
        (nest.get as jest.Mock).mockReturnValue('val');
        expect((svc as any)[prop]).toBe('val');
        expect(nest.get).toHaveBeenCalledWith(key);
    });

    it('throws when missing', () => {
        (nest.get as jest.Mock).mockReturnValue(undefined);
        expect(() => svc.bucketName).toThrow();
    });
});
