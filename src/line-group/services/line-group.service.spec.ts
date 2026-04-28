import { LineGroupService } from './line-group.service';

describe('LineGroupService', () => {
    let service: LineGroupService;
    let lineGroupRepository: any;
    let lineGroupMemberRepository: any;
    let lineGroupChatHistoryRepository: any;

    beforeEach(() => {
        lineGroupRepository = {
            upsert: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
        };
        lineGroupMemberRepository = {};
        lineGroupChatHistoryRepository = {};
        service = new LineGroupService(
            lineGroupRepository,
            lineGroupMemberRepository,
            lineGroupChatHistoryRepository,
        );
    });

    describe('insertGroupIfNotExist', () => {
        it('upserts the group with the right keys', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await service.insertGroupIfNotExist('G1', 'name', 'pic');
            expect(lineGroupRepository.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    lineGroupId: 'G1',
                    name: 'name',
                    pictureUrl: 'pic',
                    leaveGroupAt: null,
                }),
                ['lineGroupId'],
            );
            consoleSpy.mockRestore();
        });
    });

    describe('markGroupAsLeft', () => {
        it('does nothing when group not found', async () => {
            lineGroupRepository.findOne.mockResolvedValue(null);
            await service.markGroupAsLeft('G1');
            expect(lineGroupRepository.save).not.toHaveBeenCalled();
        });

        it('sets leaveGroupAt and saves when found', async () => {
            const group: any = { lineGroupId: 'G1', leaveGroupAt: null };
            lineGroupRepository.findOne.mockResolvedValue(group);
            await service.markGroupAsLeft('G1');
            expect(group.leaveGroupAt).toBeInstanceOf(Date);
            expect(lineGroupRepository.save).toHaveBeenCalledWith(group);
        });
    });
});
