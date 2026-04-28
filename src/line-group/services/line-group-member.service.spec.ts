import { LineGroupMemberService } from './line-group-member.service';

describe('LineGroupMemberService', () => {
    let service: LineGroupMemberService;
    let lineGroupMemberRepository: any;

    beforeEach(() => {
        lineGroupMemberRepository = {
            findByGroupIdAndLineUserId: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn(),
            findOne: jest.fn(),
            findTrainerInGroup: jest.fn(),
            findTraineeInGroup: jest.fn(),
        };
        service = new LineGroupMemberService(lineGroupMemberRepository);
    });

    describe('insertGroupMemberIfNotExist', () => {
        it('does nothing when member exists and active', async () => {
            lineGroupMemberRepository.findByGroupIdAndLineUserId.mockResolvedValue({ leaveGroupAt: null });
            await service.insertGroupMemberIfNotExist('G1', 'U1');
            expect(lineGroupMemberRepository.save).not.toHaveBeenCalled();
        });

        it('reactivates member when had left', async () => {
            const existing: any = { leaveGroupAt: new Date('2020-01-01') };
            lineGroupMemberRepository.findByGroupIdAndLineUserId.mockResolvedValue(existing);
            await service.insertGroupMemberIfNotExist('G1', 'U1');
            expect(existing.leaveGroupAt).toBeNull();
            expect(lineGroupMemberRepository.save).toHaveBeenCalledWith(existing);
        });

        it('creates new member when none exists', async () => {
            lineGroupMemberRepository.findByGroupIdAndLineUserId.mockResolvedValue(null);
            await service.insertGroupMemberIfNotExist('G1', 'U1');
            expect(lineGroupMemberRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                lineGroupId: 'G1',
                lineUserId: 'U1',
                leaveGroupAt: null,
            }));
            expect(lineGroupMemberRepository.save).toHaveBeenCalled();
        });
    });

    describe('markMemberAsLeft', () => {
        it('does nothing when member not found', async () => {
            lineGroupMemberRepository.findByGroupIdAndLineUserId.mockResolvedValue(null);
            await service.markMemberAsLeft('G1', 'U1');
            expect(lineGroupMemberRepository.save).not.toHaveBeenCalled();
        });

        it('sets leaveGroupAt and saves', async () => {
            const member: any = { leaveGroupAt: null };
            lineGroupMemberRepository.findByGroupIdAndLineUserId.mockResolvedValue(member);
            await service.markMemberAsLeft('G1', 'U1');
            expect(member.leaveGroupAt).toBeInstanceOf(Date);
            expect(lineGroupMemberRepository.save).toHaveBeenCalledWith(member);
        });
    });

    describe('findGroupIdByMemberLineUserId', () => {
        it('returns groupId when active member exists', async () => {
            lineGroupMemberRepository.findOne.mockResolvedValue({ lineGroupId: 'G1' });
            const r = await service.findGroupIdByMemberLineUserId('U1');
            expect(r).toBe('G1');
        });

        it('returns null when no active member', async () => {
            lineGroupMemberRepository.findOne.mockResolvedValue(null);
            const r = await service.findGroupIdByMemberLineUserId('U1');
            expect(r).toBeNull();
        });
    });

    describe('findTrainerInGroup', () => {
        it('returns null when no trainer', async () => {
            lineGroupMemberRepository.findTrainerInGroup.mockResolvedValue(null);
            const r = await service.findTrainerInGroup('G1');
            expect(r).toBeNull();
        });

        it('returns user when trainer found', async () => {
            lineGroupMemberRepository.findTrainerInGroup.mockResolvedValue({ user: { id: 1 } });
            const r = await service.findTrainerInGroup('G1');
            expect(r).toEqual({ id: 1 });
        });
    });

    describe('findTraineeInGroup', () => {
        it('returns null when no trainee', async () => {
            lineGroupMemberRepository.findTraineeInGroup.mockResolvedValue(null);
            const r = await service.findTraineeInGroup('G1');
            expect(r).toBeNull();
        });

        it('returns user when trainee found', async () => {
            lineGroupMemberRepository.findTraineeInGroup.mockResolvedValue({ user: { id: 2 } });
            const r = await service.findTraineeInGroup('G1');
            expect(r).toEqual({ id: 2 });
        });
    });
});
