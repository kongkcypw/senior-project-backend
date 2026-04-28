import { NutritionNotificationTimeService } from './nutrition-notification-time.service';

describe('NutritionNotificationTimeService', () => {
    let service: NutritionNotificationTimeService;
    let nutritionNotificationTimeRepository: any;
    let lineMessagingApiClientService: any;
    let lineGroupMemberService: any;
    let mealHistoryService: any;
    let lineLiffNavigatePathService: any;

    beforeEach(() => {
        nutritionNotificationTimeRepository = {
            findByTimeWithPlan: jest.fn(),
        };
        lineMessagingApiClientService = {
            sendPushMessages: jest.fn(),
        };
        lineGroupMemberService = {
            findGroupIdByMemberLineUserId: jest.fn(),
        };
        mealHistoryService = {
            findMealsByDate: jest.fn(),
        };
        lineLiffNavigatePathService = {
            getCaloriesInDayPage: jest.fn().mockReturnValue('http://example.com/page'),
        };

        service = new NutritionNotificationTimeService(
            nutritionNotificationTimeRepository,
            lineMessagingApiClientService,
            lineGroupMemberService,
            mealHistoryService,
            lineLiffNavigatePathService,
        );
    });

    describe('caloriesIntakeReminder', () => {
        it('does not send when needNotification is false', async () => {
            nutritionNotificationTimeRepository.findByTimeWithPlan.mockResolvedValue([
                { sendAt: '08:00:00', nutritionPlan: { needNotification: false, lineUserId: 'U1', totalCalories: 2000, id: 1 } },
            ]);
            await service.caloriesIntakeReminder();
            expect(lineMessagingApiClientService.sendPushMessages).not.toHaveBeenCalled();
        });

        it('skips when no plan attached', async () => {
            nutritionNotificationTimeRepository.findByTimeWithPlan.mockResolvedValue([
                { sendAt: '08:00:00', nutritionPlan: null },
            ]);
            await service.caloriesIntakeReminder();
            expect(lineMessagingApiClientService.sendPushMessages).not.toHaveBeenCalled();
        });

        it('logs and skips when no group found', async () => {
            nutritionNotificationTimeRepository.findByTimeWithPlan.mockResolvedValue([
                {
                    sendAt: '08:00:00',
                    nutritionPlan: { needNotification: true, lineUserId: 'U1', totalCalories: 2000, id: 1 },
                },
            ]);
            mealHistoryService.findMealsByDate.mockResolvedValue([{ calories: 500 }]);
            lineGroupMemberService.findGroupIdByMemberLineUserId.mockResolvedValue(null);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await service.caloriesIntakeReminder();
            expect(lineMessagingApiClientService.sendPushMessages).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('sends push message when group exists', async () => {
            nutritionNotificationTimeRepository.findByTimeWithPlan.mockResolvedValue([
                {
                    sendAt: '08:00:00',
                    nutritionPlan: { needNotification: true, lineUserId: 'U1', totalCalories: 2000, id: 1 },
                },
            ]);
            mealHistoryService.findMealsByDate.mockResolvedValue([{ calories: 500 }, { calories: 500 }]);
            lineGroupMemberService.findGroupIdByMemberLineUserId.mockResolvedValue('G1');
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await service.caloriesIntakeReminder();
            expect(lineMessagingApiClientService.sendPushMessages).toHaveBeenCalledWith('G1', expect.anything());
            consoleSpy.mockRestore();
        });
    });
});
