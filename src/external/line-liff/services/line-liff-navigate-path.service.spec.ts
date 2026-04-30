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

    it('builds getNutritionPlanPage', () => {
        expect(service.getNutritionPlanPage('U1')).toBe('https://liff.line.me/LIFF123//nutrition-plan/U1');
    });

    it('builds getWorkoutPlanPage', () => {
        expect(service.getWorkoutPlanPage('U1')).toBe('https://liff.line.me/LIFF123//workout-plan/U1');
    });

    it('builds getNutritionInDayPage', () => {
        expect(service.getNutritionInDayPage('U1')).toBe('https://liff.line.me/LIFF123//nutrition-in-day/U1');
    });

    it('builds getMealDetailPage', () => {
        expect(service.getMealDetailPage('U1', '5')).toBe('https://liff.line.me/LIFF123//meal-detail/U1/5');
    });

    it('builds getCreateRoutinePage', () => {
        expect(service.getCreateRoutinePage('U1')).toBe('https://liff.line.me/LIFF123//create-routine/U1');
    });

    it('builds getSelectExercisePage', () => {
        expect(service.getSelectExercisePage('U1')).toBe('https://liff.line.me/LIFF123//select-exercise/U1');
    });

    it('builds getRoutineDetailPage', () => {
        expect(service.getRoutineDetailPage('U1', '7')).toBe('https://liff.line.me/LIFF123//routine-detail/U1/7');
    });

    it('builds getEditRoutinePage', () => {
        expect(service.getEditRoutinePage('U1', '7')).toBe('https://liff.line.me/LIFF123//edit-routine/U1/7');
    });

    it('builds getLogSessionPage', () => {
        expect(service.getLogSessionPage('U1', '7')).toBe('https://liff.line.me/LIFF123//log-session/U1/7');
    });
});
