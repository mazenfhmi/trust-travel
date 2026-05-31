# Trust Travel Platform

Trust Travel is a comprehensive B2B travel management platform designed to streamline booking operations, manage payments, handle visa processing, and provide in-depth financial reporting.

## Architecture

The platform uses a monorepo architecture managed by TurboRepo and PNPM.

- **Frontend (apps/dashboard)**: Next.js 14 App Router, React 18, Tailwind CSS, Shadcn UI, React Query.
- **Backend (apps/api)**: NestJS 11, Prisma ORM, PostgreSQL, Redis, Socket.io.
- **Shared Packages**: `@trust-travel/shared` for common interfaces and DTOs.

## Quickstart

Follow the detailed instructions in [docs/quickstart.md](docs/quickstart.md) or see a brief summary below:

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Setup
1. Clone the repository
2. Run `pnpm install`
3. Start the database and redis services: `docker-compose up -d`
4. Copy `.env.example` to `.env` in both `apps/api` and `apps/dashboard`
5. Run migrations: `pnpm --filter api prisma:migrate`
6. Seed the database: `pnpm --filter api seed`
7. Start development servers: `pnpm dev`

## Contribution Guidelines

1. Create a new branch for each feature: `feature/US1-flight-booking`
2. Follow conventional commits for all commit messages.
3. Ensure all tests pass (`pnpm test`) before creating a PR.
4. Update `specs/001-travel-platform-backend/tasks.md` to reflect progress.
