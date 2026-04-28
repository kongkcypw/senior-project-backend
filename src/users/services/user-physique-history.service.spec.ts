import { UserPhysiqueHistoryService } from './user-physique-history.service';
import { UserPhysiqueDto } from '../dto/user-physique.dto';

jest.mock('../messages/trainee-info.message', () => ({
    TraineeInfoMessage: jest.fn(() => [{ type: 'text', text: 'mock' }]),
}));

jest.mock('../dto/user-physique.dto', () => ({
    UserPhysiqueDto: { fromEntity: jest.fn((e) => ({ ...e, dto: true })) },
}));

describe('UserPhysiqueHistoryService', () => {
    let service: UserPhysiqueHistoryService;
    let userPhysiqueHistoryRepository: any;
    let userRepository: any;
    let lineMessagingApiService: any;
    let lineGroupMemberService: any;

    beforeEach(() => {
        userPhysiqueHistoryRepository = {
            findByLineUserId: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn(),
        };
        userRepository = {
            findOneBy: jest.fn(),
        };
        lineMessagingApiService = {
            sendPushMessages: jest.fn(),
        };
        lineGroupMemberService = {
            findGroupIdByMemberLineUserId: jest.fn(),
        };
        service = new UserPhysiqueHistoryService(
            userPhysiqueHistoryRepository,
            userRepository,
            lineMessagingApiService,
            lineGroupMemberService,
        );
        jest.clearAllMocks();
    });

    describe('getPhysiqueHistoryByLineUserId', () => {
        it('maps entities to DTOs', async () => {
            const entities = [{ id: 1 }, { id: 2 }];
            userPhysiqueHistoryRepository.findByLineUserId.mockResolvedValue(entities);
            (UserPhysiqueDto.fromEntity as jest.Mock).mockImplementation((e) => ({ ...e, dto: true }));
            const result = await service.getPhysiqueHistoryByLineUserId('U1');
            expect(userPhysiqueHistoryRepository.findByLineUserId).toHaveBeenCalledWith('U1');
            expect(result).toHaveLength(2);
        });
    });

    describe('insertPhysiqueHistoryForTrainee', () => {
        const params = {
            lineUserId: 'U1',
            age: 30,
            weight: 70,
            height: 175,
            bodyFatPercentage: 15,
            goal: 'lose',
        };

        it('inserts and returns when more than one history record exists', async () => {
            userPhysiqueHistoryRepository.findByLineUserId.mockResolvedValue([{}, {}]);
            await service.insertPhysiqueHistoryForTrainee(params);
            expect(userPhysiqueHistoryRepository.save).toHaveBeenCalled();
            expect(userRepository.findOneBy).not.toHaveBeenCalled();
            expect(lineMessagingApiService.sendPushMessages).not.toHaveBeenCalled();
        });

        it('throws when user not found and only one history record exists', async () => {
            userPhysiqueHistoryRepository.findByLineUserId.mockResolvedValue([{}]);
            userRepository.findOneBy.mockResolvedValue(null);
            await expect(service.insertPhysiqueHistoryForTrainee(params)).rejects.toThrow('User not found');
        });

        it('does not push when groupId is null', async () => {
            userPhysiqueHistoryRepository.findByLineUserId.mockResolvedValue([{}]);
            userRepository.findOneBy.mockResolvedValue({ lineUserId: 'U1', displayName: 'A' });
            lineGroupMemberService.findGroupIdByMemberLineUserId.mockResolvedValue(null);
            await service.insertPhysiqueHistoryForTrainee(params);
            expect(lineMessagingApiService.sendPushMessages).not.toHaveBeenCalled();
        });

        it('sends push message when groupId exists', async () => {
            userPhysiqueHistoryRepository.findByLineUserId.mockResolvedValue([{}]);
            userRepository.findOneBy.mockResolvedValue({ lineUserId: 'U1', displayName: 'A' });
            lineGroupMemberService.findGroupIdByMemberLineUserId.mockResolvedValue('G1');
            await service.insertPhysiqueHistoryForTrainee(params);
            expect(lineMessagingApiService.sendPushMessages).toHaveBeenCalledWith('G1', expect.any(Array));
        });
    });
});
