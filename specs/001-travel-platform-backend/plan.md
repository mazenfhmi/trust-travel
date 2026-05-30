# Implementation Plan: Integrated Travel Platform — Backend & Control Panel

**Branch**: `001-travel-platform-backend` | **Date**: 2026-05-30 | **Spec**: [spec.md](file:///Users/fahmifareed/Documents/trust-travel/specs/001-travel-platform-backend/spec.md)

**Input**: Feature specification from `/specs/001-travel-platform-backend/spec.md`

## Summary

Build an integrated travel platform consisting of a NestJS backend API and a Next.js (App Router) admin control panel. The backend handles flight bookings, hotel bookings, and Umrah visa applications with Maqam platform integration. The control panel enables admins to manage bookings, review visa applications, and generate financial reports. Architecture follows modular NestJS design with Prisma ORM, JWT authentication with role-based guards, WebSocket notifications, and queue-based external integrations.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js ≥ 20 LTS

**Primary Dependencies**:
- Backend: NestJS ≥ 10, Prisma ORM, Passport-JWT, BullMQ, Socket.IO, Multer, Nodemailer
- Control Panel: Next.js ≥ 14 (App Router), Tailwind CSS, @tanstack/react-query, Shadcn/ui, next-intl

**Storage**: PostgreSQL ≥ 15 (via Prisma), Redis ≥ 7 (BullMQ queues + caching), S3-compatible object store (documents)

**Testing**:
- Backend: Jest + @nestjs/testing (unit + e2e)
- Control Panel: Vitest + @testing-library/react

**Target Platform**: Linux server (Docker), web browsers (Chrome, Safari, Firefox)

**Project Type**: Web application (API + Admin dashboard)

**Performance Goals**: < 200 ms p95 API latency for CRUD, < 3 s search results, 500 concurrent users

**Constraints**: PCI-DSS compliance via payment gateway delegation, JPEG/PNG uploads ≤ 5 MB, Arabic + English i18n

**Scale/Scope**: ~20 API endpoints, ~15 control panel screens, 12 database entities, 13 enums

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Modular Architecture | ✅ PASS | 7 independent NestJS modules (Auth, Flights, Hotels, Visas, Payments, Notifications, Admin). Control panel uses route-segment co-location. |
| II. DTO Validation | ✅ PASS | Every endpoint defines request/response DTOs with class-validator. Global ValidationPipe with whitelist + transform. |
| III. JWT + Role Guards | ✅ PASS | Passport-JWT AuthGuard + custom RolesGuard with deny-by-default. 5 roles defined. bcrypt password hashing. |
| IV. Server Components First | ✅ PASS | Control panel defaults to RSC. Client boundaries only for interactive components (forms, real-time widgets). |
| V. Performance | ✅ PASS | Prisma pagination on all list endpoints. Redis caching for search results. next/image for hotel photos. Bundle size monitoring planned. |
| VI. Professional UI | ✅ PASS | Shadcn/ui + Tailwind CSS design tokens. Skeleton loaders for async states. Lucide icons throughout. |
| VII. Testing | ✅ PASS | Unit tests per service, e2e per controller. Component tests for shared UI. Co-located test files. |

**Gate Result**: ✅ ALL PASS — proceeding to design.

## Project Structure

### Documentation (this feature)

```text
specs/001-travel-platform-backend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth-api.md
│   ├── flights-api.md
│   ├── hotels-api.md
│   ├── visas-api.md
│   └── payments-admin-notifications-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
trust-travel/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/              # Shared utilities
│   │   │   │   ├── decorators/      # @Roles(), @Public(), @CurrentUser()
│   │   │   │   ├── guards/          # JwtAuthGuard, RolesGuard
│   │   │   │   ├── pipes/           # GlobalValidationPipe config
│   │   │   │   ├── filters/         # HttpExceptionFilter
│   │   │   │   ├── interceptors/    # TransformInterceptor, LoggingInterceptor
│   │   │   │   └── dto/             # PaginationDto, SortDto (shared)
│   │   │   ├── auth/                # AuthModule
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/      # JwtStrategy, JwtRefreshStrategy
│   │   │   │   └── dto/             # LoginDto, RegisterDto, RefreshDto
│   │   │   ├── flights/             # FlightsModule
│   │   │   │   ├── flights.module.ts
│   │   │   │   ├── flights.controller.ts
│   │   │   │   ├── flights.service.ts
│   │   │   │   ├── providers/       # FlightProviderInterface, MockProvider
│   │   │   │   └── dto/             # SearchFlightsDto, BookFlightDto, etc.
│   │   │   ├── hotels/              # HotelsModule
│   │   │   │   ├── hotels.module.ts
│   │   │   │   ├── hotels.controller.ts
│   │   │   │   ├── hotels.service.ts
│   │   │   │   ├── rooms.service.ts
│   │   │   │   ├── reviews.service.ts
│   │   │   │   ├── providers/       # HotelProviderInterface, MockProvider
│   │   │   │   └── dto/
│   │   │   ├── visas/               # VisasModule
│   │   │   │   ├── visas.module.ts
│   │   │   │   ├── visas.controller.ts
│   │   │   │   ├── visas.service.ts
│   │   │   │   ├── documents.service.ts
│   │   │   │   ├── maqam/           # MaqamIntegrationService, MaqamProcessor
│   │   │   │   └── dto/
│   │   │   ├── payments/            # PaymentsModule
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   ├── refunds.service.ts
│   │   │   │   ├── gateways/        # PaymentGatewayInterface, MoyasarGateway
│   │   │   │   └── dto/
│   │   │   ├── notifications/       # NotificationsModule
│   │   │   │   ├── notifications.module.ts
│   │   │   │   ├── notifications.controller.ts
│   │   │   │   ├── notifications.service.ts
│   │   │   │   ├── notifications.gateway.ts  # WebSocket gateway
│   │   │   │   ├── email.service.ts
│   │   │   │   └── dto/
│   │   │   └── admin/               # AdminModule
│   │   │       ├── admin.module.ts
│   │   │       ├── dashboard.controller.ts
│   │   │       ├── reports.controller.ts
│   │   │       ├── reports.service.ts
│   │   │       └── dto/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── test/                    # e2e tests
│   │   │   ├── auth.e2e-spec.ts
│   │   │   ├── flights.e2e-spec.ts
│   │   │   ├── hotels.e2e-spec.ts
│   │   │   ├── visas.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env.example
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── dashboard/                   # Next.js Control Panel
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx       # Root layout (RSC)
│       │   │   ├── page.tsx         # Dashboard home
│       │   │   ├── loading.tsx
│       │   │   ├── error.tsx
│       │   │   ├── (auth)/
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── layout.tsx
│       │   │   ├── bookings/
│       │   │   │   ├── page.tsx           # Booking list
│       │   │   │   ├── [id]/page.tsx      # Booking detail
│       │   │   │   ├── loading.tsx
│       │   │   │   └── error.tsx
│       │   │   ├── flights/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [id]/page.tsx
│       │   │   ├── hotels/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [id]/page.tsx
│       │   │   ├── visas/
│       │   │   │   ├── page.tsx           # Visa queue
│       │   │   │   ├── [id]/page.tsx      # Visa detail + review
│       │   │   │   ├── loading.tsx
│       │   │   │   └── error.tsx
│       │   │   ├── reports/
│       │   │   │   ├── page.tsx           # Financial reports
│       │   │   │   ├── loading.tsx
│       │   │   │   └── error.tsx
│       │   │   └── settings/
│       │   │       └── page.tsx
│       │   ├── components/
│       │   │   ├── ui/              # Shadcn/ui primitives
│       │   │   ├── layout/          # Sidebar, Header, Breadcrumbs
│       │   │   ├── dashboard/       # SummaryCard, StatusBadge
│       │   │   ├── bookings/        # BookingTable, BookingDetail
│       │   │   ├── visas/           # VisaQueue, DocumentViewer
│       │   │   ├── reports/         # ReportChart, ExportButton
│       │   │   └── shared/          # DataTable, Pagination, SearchInput
│       │   ├── lib/
│       │   │   ├── api.ts           # API client (fetch wrapper)
│       │   │   ├── auth.ts          # Auth helpers (cookies, middleware)
│       │   │   ├── utils.ts
│       │   │   └── constants.ts
│       │   ├── hooks/               # React Query hooks
│       │   │   ├── use-bookings.ts
│       │   │   ├── use-visas.ts
│       │   │   ├── use-reports.ts
│       │   │   └── use-notifications.ts
│       │   ├── providers/
│       │   │   ├── query-provider.tsx    # React Query provider (client)
│       │   │   ├── socket-provider.tsx   # WebSocket provider (client)
│       │   │   └── theme-provider.tsx
│       │   └── messages/            # i18n
│       │       ├── ar.json
│       │       └── en.json
│       ├── tailwind.config.ts
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── .env.example
│       └── package.json
│
├── packages/
│   └── shared/                      # Shared TypeScript types
│       ├── src/
│       │   ├── types/               # Entity types, enums
│       │   ├── constants/           # Shared constants
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── docker-compose.yml               # PostgreSQL + Redis + MinIO
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── package.json
```

**Structure Decision**: Web application (Option 2) adapted as a pnpm monorepo with `apps/api` (NestJS), `apps/dashboard` (Next.js), and `packages/shared` (types). This follows Constitution Principle I (modular) and the research decision R-009 (monorepo with pnpm workspaces).

## Complexity Tracking

> **No violations detected** — all design decisions align with constitution principles.
