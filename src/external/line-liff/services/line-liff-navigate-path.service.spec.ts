import { LineLiffNavigatePathService } from './line-liff-navigate-path.service';

describe('LineLiffNavigatePathService', () => {
    let service: LineLiffNavigatePathService;
    let configService: any;

    beforeEach(() => {
        configService = { liffId: 'LIFF123' };
        service = new LineLiffNavigatePathService(configService);
    });

    it('builds navigateProfilePage', () => {
        expect(service.navigateProfilePage).toBe('https://liff.line.me/LIFF123//profile');
    });

    it('builds getBodyInformationPage', () => {
        expect(service.getBodyInformationPage('U1')).toBe('https://liff.line.me/LIFF123//body-info/U1');
    });

    it('builds getManageNutritionProgramPage', () => {
        expect(service.getManageNutritionProgramPage('U1')).toBe('https://liff.line.me/LIFF123//manage-plan/nutrition/U1');
    });

    it('builds getManageWorkoutProgramPage', () => {
        expect(service.getManageWorkoutProgramPage('U1')).toBe('https://liff.line.me/LIFF123//manage-plan/workout/U1');
    });

    it('builds getCaloriesInDayPage', () => {
        expect(service.getCaloriesInDayPage('U1')).toBe('https://liff.line.me/LIFF123//nutrition-in-day/U1');
    });

    it('builds getWorkoutProgramPage', () => {
        expect(service.getWorkoutProgramPage('U1')).toBe('https://liff.line.me/LIFF123//manage-plan/workout/U1');
    });

    it('builds getMealDetailPage', () => {
        expect(service.getMealDetailPage('U1', '5')).toBe('https://liff.line.me/LIFF123//meal-detail/U1/5');
    });
});
