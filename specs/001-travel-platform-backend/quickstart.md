# Quickstart: Trust Travel Platform

## Prerequisites

- Node.js ≥ 20 LTS
- pnpm ≥ 9
- PostgreSQL ≥ 15 (running locally or via Docker)
- Redis ≥ 7 (for BullMQ queues)
- Docker & Docker Compose (recommended for local services)

## 1. Clone & Install

```bash
git clone <repo-url> trust-travel
cd trust-travel
pnpm install
```

## 2. Start Infrastructure (Docker)

```bash
docker compose up -d  # PostgreSQL + Redis + MinIO (S3-compatible)
```

## 3. Configure Environment

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with:
#   DATABASE_URL=postgresql://user:password@localhost:5432/trust_travel
#   REDIS_URL=redis://localhost:6379
#   JWT_SECRET=<generate-a-strong-secret>
#   JWT_EXPIRY=15m
#   REFRESH_TOKEN_EXPIRY=7d
#   MOYASAR_API_KEY=<your-key>
#   MAQAM_API_URL=<maqam-endpoint>
#   S3_ENDPOINT=http://localhost:9000
#   S3_BUCKET=trust-travel-docs
#   S3_ACCESS_KEY=minioadmin
#   S3_SECRET_KEY=minioadmin
#   SMTP_HOST=<smtp-host>
#   SMTP_PORT=587
#   SMTP_USER=<user>
#   SMTP_PASS=<pass>

# Control Panel
cp apps/dashboard/.env.example apps/dashboard/.env
# Edit apps/dashboard/.env with:
#   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
#   NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## 4. Run Database Migrations

```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed  # Seeds admin users + sample data
```

## 5. Start Development Servers

```bash
# From project root (runs both apps)
pnpm dev

# Or individually:
pnpm --filter api dev        # Backend on http://localhost:3001
pnpm --filter dashboard dev  # Control Panel on http://localhost:3000
```

## 6. Verify Setup

1. **API Health**: `curl http://localhost:3001/api/v1/health`
2. **Control Panel**: Open `http://localhost:3000` → Login with seeded admin
3. **API Docs**: Open `http://localhost:3001/api/docs` (Swagger UI)

## 7. Run Tests

```bash
# All tests
pnpm test

# Backend only
pnpm --filter api test
pnpm --filter api test:e2e

# Control Panel only
pnpm --filter dashboard test
```

## Default Seed Users

| Email | Password | Role |
|-------|----------|------|
| admin@trusttravel.sa | Admin123! | SUPER_ADMIN |
| agent@trusttravel.sa | Agent123! | BOOKING_AGENT |
| visa@trusttravel.sa | Visa123! | VISA_REVIEWER |
| finance@trusttravel.sa | Finance123! | FINANCE_VIEWER |
| traveler@test.com | Travel123! | TRAVELER |
