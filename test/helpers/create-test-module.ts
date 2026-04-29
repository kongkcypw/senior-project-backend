import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DevAuthGuard } from 'src/auth/guards/dev-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/enums/user-role.enum';

/** Default mock trainer injected into req.user when auth is bypassed. */
export const MOCK_TRAINER = {
    id: 1,
    lineUserId: 'U_TRAINER_001',
    displayName: 'Test Trainer',
    pictureUrl: 'https://example.com/trainer.jpg',
    role: UserRole.TRAINER,
};

export const MOCK_TRAINEE = {
    id: 2,
    lineUserId: 'U_TRAINEE_001',
    displayName: 'Test Trainee',
    pictureUrl: 'https://example.com/trainee.jpg',
    role: UserRole.TRAINEE,
};

/**
 * Builds a NestJS test application from a module metadata object.
 * - Overrides DevAuthGuard to inject `mockUser` into req.user.
 * - Overrides RolesGuard to always allow access.
 *
 * @param moduleMetadata - controllers + providers to register
 * @param mockUser - the user object placed on req.user (defaults to MOCK_TRAINER)
 */
export async function buildTestApp(
    moduleMetadata: Parameters<typeof Test.createTestingModule>[0],
    mockUser: Record<string, any> = MOCK_TRAINER,
): Promise<INestApplication> {
    const moduleRef = await Test.createTestingModule(moduleMetadata)
        .overrideGuard(DevAuthGuard)
        .useValue({
            canActivate: (ctx: ExecutionContext) => {
                ctx.switchToHttp().getRequest().user = mockUser;
                return true;
            },
        })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: () => true })
        .compile();

    const app = moduleRef.createNestApplication();
    app.useLogger(false);   // suppress NestJS error logs during tests
    await app.init();
    return app;
}
