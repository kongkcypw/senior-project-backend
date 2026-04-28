import { CloudFlareR2Service } from './cloudflare-r2.service';

const mockSend = jest.fn();
jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
    PutObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

describe('CloudFlareR2Service', () => {
    let service: CloudFlareR2Service;
    let configService: any;

    beforeEach(() => {
        configService = {
            nodeEnv: 'local',
            endpoint: 'http://endpoint',
            accessKeyId: 'A',
            secretAccessKey: 'S',
            bucketName: 'bucket',
            customDomain: 'http://cdn.example.com',
        };
        mockSend.mockReset();
        service = new CloudFlareR2Service(configService);
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('uploadBuffer', () => {
        it('uploads and returns public URL with local prefix', async () => {
            mockSend.mockResolvedValue({});
            const r = await service.uploadBuffer('foo.jpg', Buffer.from('hello'), 'image/jpeg');
            expect(r).toBe('http://cdn.example.com/local/foo.jpg');
            expect(mockSend).toHaveBeenCalled();
        });

        it('uses production prefix for production env', async () => {
            configService.nodeEnv = 'production';
            mockSend.mockResolvedValue({});
            const r = await service.uploadBuffer('foo.jpg', Buffer.from('h'), 'image/jpeg');
            expect(r).toBe('http://cdn.example.com/production/foo.jpg');
        });

        it('uses development prefix for development env', async () => {
            configService.nodeEnv = 'development';
            mockSend.mockResolvedValue({});
            const r = await service.uploadBuffer('foo.jpg', Buffer.from('h'), 'image/jpeg');
            expect(r).toBe('http://cdn.example.com/development/foo.jpg');
        });

        it('strips trailing slash on customDomain', async () => {
            configService.customDomain = 'http://cdn.example.com/';
            mockSend.mockResolvedValue({});
            const r = await service.uploadBuffer('foo.jpg', Buffer.from('h'), 'image/jpeg');
            expect(r).toBe('http://cdn.example.com/local/foo.jpg');
        });

        it('returns null on upload error', async () => {
            mockSend.mockRejectedValue(new Error('boom'));
            const r = await service.uploadBuffer('foo.jpg', Buffer.from('h'), 'image/jpeg');
            expect(r).toBeNull();
        });
    });
});
