# Backend E2E Test Guide

End-to-end tests live in `backend/test/` and verify the **HTTP layer** of each controller:
routing, status codes, request parsing, and guard behavior.  
Business logic edge cases belong in **unit tests** (`src/**/*.spec.ts`).

---

## Running E2E Tests

```bash
cd backend
pnpm test:e2e          # runs jest --config ./test/jest-e2e.json
```

---

## Core Rules

| Rule | Reason |
|---|---|
| **Factory pattern for all test data** | Keeps tests self-contained; no dependency on seed files or DB state |
| **Mock external services** (LINE, Gemini, Dialogflow, RAG) | Prevent real API calls; tests must work offline and deterministically |
| **One success + one fail case per endpoint** | Exhaustive edge cases belong in unit tests; e2e verifies HTTP plumbing |
| **Mock the service, not the repository** | E2E tests check the controller→service boundary; repos are unit-test territory |
| **Override guards, not skip them** | Guards are part of the pipeline; override them to inject a fake user |

---

## Directory Structure

```
test/
├── e2e-setup.ts                 # Sets NODE_ENV=local + initializes transactional context
├── jest-e2e.json                # Jest config: moduleNameMapper, setupFiles, testRegex
├── helpers/
│   └── create-test-module.ts   # buildTestApp() — module builder with auth bypass
├── factories/
│   ├── user.factory.ts          # UserFactory.trainer() / trainee() / physiqueHistory()
│   ├── nutrition.factory.ts     # MealHistoryFactory.create() / NutritionPlanFactory.create()
│   └── workout.factory.ts       # WorkoutProgramFactory / RoutineFactory / HistoryFactory
└── *.e2e-spec.ts                # One file per controller
```

---

## How Auth is Bypassed

`e2e-setup.ts` sets `process.env.NODE_ENV = 'local'` before any module imports.  
This causes `getProtectedGuards()` in `src/utils/guards.util.ts` to return
`[DevAuthGuard, RolesGuard]` instead of the real LIFF passport guard.

`buildTestApp()` then overrides both guards:

```typescript
// helpers/create-test-module.ts
moduleRef
  .overrideGuard(DevAuthGuard)
  .useValue({
    canActivate: (ctx: ExecutionContext) => {
      ctx.switchToHttp().getRequest().user = mockUser;  // inject fake user
      return true;
    },
  })
  .overrideGuard(RolesGuard)
  .useValue({ canActivate: () => true });  // always allow
```

Controllers with **no guards** (e.g., `LineWebhookController`) skip `buildTestApp()`
and use `Test.createTestingModule()` directly.

---

## Writing a New E2E Test

### 1. Create the spec file

```typescript
// test/my-feature.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MyController } from 'src/my-feature/controllers/my.controller';
import { MyService } from 'src/my-feature/services/my.service';
import { buildTestApp } from './helpers/create-test-module';
import { MyFactory } from './factories/my.factory';

describe('MyController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<MyService, 'findById' | 'create'>>;

    beforeAll(async () => {
        mockService = {
            findById: jest.fn(),
            create: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [MyController],
            providers: [{ provide: MyService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /my-resource/:id', () => {
        it('200 - returns resource when found', async () => {
            const entity = MyFactory.create();
            mockService.findById.mockResolvedValue(entity);

            await request(app.getHttpServer())
                .get('/my-resource/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(1);
                });
        });

        it('404 - returns not found when missing', async () => {
            mockService.findById.mockRejectedValue(new NotFoundException());

            await request(app.getHttpServer())
                .get('/my-resource/999')
                .expect(404);
        });
    });
});
```

### 2. Add a factory (if the module is new)

```typescript
// test/factories/my.factory.ts
export const MyFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            name: 'Test Entity',
            createdAt: new Date('2024-01-01'),
            ...override,
        };
    },
};
```

### 3. Test an endpoint with an external service

Mock the external service provider instead of the repository:

```typescript
// In the test module providers array:
{ provide: GeminiService, useValue: { analyzeFoodImage: jest.fn().mockResolvedValue(mockResult) } },
{ provide: LineMessagingApiClientService, useValue: { pushMessage: jest.fn() } },
```

Never instantiate `GeminiService` or `LineMessagingApiClientService` for real — they call
external APIs and require production credentials.

---

## What to Test

| Scenario | Status code | Notes |
|---|---|---|
| Happy path — valid input, service resolves | 200 / 201 | Verify key fields in response body |
| Not found — service throws `NotFoundException` | 404 | |
| Server error — service throws generic `Error` | 500 | |
| Validation failure — missing/invalid body field | 400 | Uses NestJS class-validator pipe |
| Invalid path param type — e.g. `abc` for `ParseIntPipe` | 400 | Only where `ParseIntPipe` is used |
| Invalid query param — e.g. wrong `period` value | 400 | Where controller validates query params |

Keep it to **two cases per endpoint**. If you find yourself adding a third, it probably
belongs in a unit test.

---

## Conventions

- Use `beforeAll` (not `beforeEach`) to build the app once per `describe` block — faster.
- Always call `afterAll(() => app.close())` to release the HTTP server.
- Reset mocks between tests if the same mock is used across multiple `describe` blocks:
  ```typescript
  beforeEach(() => jest.clearAllMocks());
  ```
- Use `MOCK_TRAINER` / `MOCK_TRAINEE` constants from `helpers/create-test-module.ts`
  as the default authenticated user. Override when a test specifically needs a trainee role.
