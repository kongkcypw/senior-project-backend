# Backend — NestJS API

NestJS API server for the LINE Fitness Trainer Dashboard. Handles authentication, trainer/trainee data, workout & nutrition tracking, LINE webhook events, and orchestrates the Food AI and RAG microservices.

## Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/)
- Docker (for running PostgreSQL locally)
- A PostgreSQL database with the `pgvector` extension (the included `docker-compose.yml` sets this up for you)
- Access credentials for: LINE Messaging API / LIFF, Google Dialogflow, Google Gemini, Cloudflare R2

## Installation

1. Install dependencies

   ```bash
   cd backend
   pnpm install
   ```

2. Start a local PostgreSQL instance with Docker

   ```bash
   docker compose up -d
   ```

3. Create your environment file

   ```bash
   cp .env.example .env
   ```

4. Fill in `.env`

   | Variable | Description |
   |---|---|
   | `NODE_ENV` | `local` for development (enables `DevAuthGuard` to bypass real JWT validation), `production` otherwise. |
   | `PORT` | Port the API listens on (default `3000`). |
   | `DB_LOG` | Set to `true` to log TypeORM SQL queries. |
   | `LINE_CHANNEL_SECRET` / `LINE_CHANNEL_ACCESS_TOKEN` | Credentials from the LINE Developers Console for the Messaging API channel. |
   | `LINE_CHATBOT_USER_ID` / `LINE_CHATBOT_DASHBOARD_ID` | LINE user IDs of the trainee-side and dashboard-side bot accounts. |
   | `POSTGRES_HOST` / `POSTGRES_PORT` / `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Connection details for PostgreSQL. Match these to `docker-compose.yml` for local dev, or to your managed instance (e.g. Aiven) in production. |
   | `AIVEN_CA_CERT` | CA certificate for SSL connections to a managed Postgres provider (e.g. Aiven). Not needed for local Docker Postgres. |
   | `DIALOGFLOW_AGENT_ID` / `GOOGLE_CLOUD_PROJECT_ID` / `GOOGLE_CLOUD_PRIVATE_KEY` / `GOOGLE_CLOUD_CLIENT_EMAIL` | Google Cloud service account credentials used to call Dialogflow for chatbot intent classification. |
   | `CLOUDFLARE_R2_*` | Cloudflare R2 bucket credentials and endpoint for storing food images and uploaded documents. |
   | `GEMINI_API_KEY` | API key for Google Gemini, used for food image analysis. |
   | `LIFF_ID` / `LIFF_NUMERIC_ID` | LINE LIFF App IDs used to build navigation links sent by the chatbot. |
   | `FRONTEND_BASE_URL` / `FRONTEND_DASHBOARD_BASE_URL` | Base URLs of the trainee app (`frontend`) and trainer dashboard (`frontend-dashboard`), used when generating LIFF deep links. |
   | `RAG_API_URL` | Base URL of the `backend-rag-service` FastAPI server (default `http://localhost:8000`). |

5. Run database migrations

   ```bash
   pnpm typeorm:migration:run
   ```

6. (Optional) Seed the database with mock data

   ```bash
   pnpm seed:run
   ```

   This truncates and repopulates all tables — see `db/seeds/` for the 13 seed files (users, programs, history, etc.).

7. Start the dev server

   ```bash
   pnpm start:dev
   ```

   The API runs at [http://localhost:3000](http://localhost:3000).

8. (Optional) Expose your local server to the internet for LINE webhook testing

   Use a tunneling tool such as [ngrok](https://ngrok.com/) and set the resulting URL as the webhook endpoint in the LINE Developers Console.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm start:dev` | Start in watch mode with `NODE_ENV=local` |
| `pnpm start` | Start without watch mode |
| `pnpm start:prod` | Run the compiled `dist/` build |
| `pnpm build` | Compile TypeScript with `nest build` |
| `pnpm lint` | Run ESLint with autofix |
| `pnpm test` | Run unit tests (Jest) |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:cov` | Run tests with coverage report |
| `pnpm typeorm:migration:run` | Build and apply pending TypeORM migrations |
| `pnpm typeorm:migration:revert` | Revert the last applied migration |
| `pnpm typeorm:migration:create` | Create a new empty migration file under `db/migrations` |
| `pnpm seed:run` | Build and run all database seeds |

## Notes

- This service has a hard dependency on `backend-rag-service` for RAG/chatbot responses (`RAG_API_URL`) — start that service as well if you need chatbot functionality end to end.
- `WorkoutModule` and `NutritionModule` both import `UserModule`; never import either of them back into `UserModule` to avoid a circular dependency (see the root [CLAUDE.md](../CLAUDE.md) for details).
- Deployment uses Docker; see `docker-compose.yml` and the `Dockerfile` for the production container build.
