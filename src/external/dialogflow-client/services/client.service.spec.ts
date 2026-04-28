import { DialogflowClientService } from './client.service';

const mockSessionsClient = jest.fn();
jest.mock('@google-cloud/dialogflow', () => ({
    SessionsClient: jest.fn().mockImplementation((opts) => mockSessionsClient(opts)),
}));

describe('DialogflowClientService', () => {
    let service: DialogflowClientService;
    let configService: any;

    beforeEach(() => {
        configService = {
            projectId: 'pid',
            clientEmail: 'a@b.com',
            privateKey: 'KEY',
        };
        mockSessionsClient.mockReset();
        service = new DialogflowClientService(configService);
    });

    describe('createSessionsClient', () => {
        it('instantiates a SessionsClient with credentials', () => {
            mockSessionsClient.mockReturnValue({ name: 'client' });
            const r = service.createSessionsClient();
            expect(mockSessionsClient).toHaveBeenCalledWith({
                projectId: 'pid',
                credentials: {
                    client_email: 'a@b.com',
                    private_key: 'KEY',
                },
            });
            expect(r).toBeDefined();
        });
    });
});
