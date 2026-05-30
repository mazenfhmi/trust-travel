# Research: Integrated Travel Platform — Backend & Control Panel

**Date**: 2026-05-30
**Branch**: `001-travel-platform-backend`

## R-001: NestJS Modular Architecture with Prisma ORM

**Decision**: Use NestJS ≥ 10 with Prisma ORM on PostgreSQL ≥ 15. Each domain (Flights, Hotels, Visas, Auth, Payments, Notifications) is an independent NestJS module.

**Rationale**: The user explicitly specified NestJS + PostgreSQL + Prisma. Prisma provides type-safe database access, auto-generated migrations, and a declarative schema. NestJS modules enforce encapsulation (Constitution Principle I). Each module contains its own controller, service, DTOs, and Prisma-delegated repository logic.

**Alternatives considered**:
- TypeORM: More traditional, but Prisma's schema-first approach generates stronger TypeScript types and simplifies migration management.
- MikroORM: Capable but smaller ecosystem; Prisma is the user's explicit choice.

---

## R-002: Authentication & Authorization (JWT + Role-Based Guards)

**Decision**: Use `@nestjs/passport` with JWT strategy for authentication. Implement a custom `RolesGuard` that reads `@Roles()` decorators. Tokens are short-lived (15 min access, 7-day refresh with rotation). Passwords hashed with bcrypt (12 rounds).

**Rationale**: Constitution Principle III mandates JWT AuthGuard + RolesGuard with deny-by-default. Passport-JWT is the standard NestJS integration. Refresh token rotation prevents token theft escalation.

**Alternatives considered**:
- Session-based auth: Not suitable for API-first architecture where the control panel is a separate Next.js app.
- OAuth2/OIDC: Overkill for v1 where only internal users and travelers need auth; can be added later for SSO.

**Roles defined**:
| Role | Scope |
|------|-------|
| `traveler` | Search, book, apply for visas, view own bookings |
| `booking-agent` | View/manage all bookings, cancel/modify |
| `visa-reviewer` | View/approve/reject visa applications |
| `finance-viewer` | Access financial reports, export data |
| `super-admin` | Full access to all features + user management |

---

## R-003: Payment Gateway Integration

**Decision**: Integrate with **Moyasar** as the primary payment gateway for the Saudi market. Abstract the gateway behind a `PaymentGatewayInterface` to support swapping providers.

**Rationale**: Moyasar supports SAR, is PCI-DSS compliant, popular in the Saudi market, and provides a well-documented REST API. The abstraction layer (Constitution Principle I — modular) allows adding HyperPay or Tap later.

**Alternatives considered**:
- Tap Payments: Viable but Moyasar has stronger SAR-native support.
- Stripe: Does not natively support SAR or Saudi-market payment methods (mada cards).
- HyperPay: Viable secondary option; can be added behind the same interface.

---

## R-004: Flight & Hotel Data Sources (GDS/Aggregator APIs)

**Decision**: Design the FlightsModule and HotelsModule behind provider interfaces (`FlightProviderInterface`, `HotelProviderInterface`). For v1, use mock/seed data providers. Real GDS integration (Amadeus, Sabre, or a Saudi-market aggregator) will be swapped in once API credentials are provisioned.

**Rationale**: GDS contracts require business agreements that take weeks to finalize. The interface pattern lets development proceed with mock data while maintaining the exact API surface for the real provider. The spec assumes "third-party GDS/aggregator APIs (specific provider TBD)."

**Alternatives considered**:
- Direct Amadeus integration from day 1: Blocks development on credential provisioning.
- Scraping OTAs: Legally risky, unreliable, and against TOS.

---

## R-005: Maqam Platform Integration

**Decision**: Implement a `MaqamIntegrationService` behind a queue-based architecture. Approved visa applications are placed in a Bull/BullMQ queue. A worker processes submissions to the Maqam REST API, handles retries with exponential backoff, and polls for status updates on a configurable interval.

**Rationale**: The spec mandates retry-on-failure (FR-020, edge case). BullMQ is the standard NestJS queue (via `@nestjs/bullmq`) backed by Redis. Queue-based approach ensures resilience when Maqam is unreachable.

**Alternatives considered**:
- Synchronous HTTP calls: Violates the retry requirement and blocks the admin workflow.
- Kafka: Over-engineered for the expected volume; BullMQ is sufficient and simpler.

---

## R-006: Real-Time Notifications (WebSockets)

**Decision**: Use `@nestjs/websockets` with Socket.IO for real-time notifications. The `NotificationsModule` broadcasts visa status changes and booking confirmations to connected clients. Email notifications use `@nestjs-modules/mailer` with Nodemailer + an SMTP provider.

**Rationale**: The user explicitly requested WebSocket middleware for instant visa status updates. Socket.IO provides reconnection, room-based messaging (per-user rooms), and broad browser support. Email is the fallback channel per spec (FR-012).

**Alternatives considered**:
- Server-Sent Events (SSE): Simpler but unidirectional; Socket.IO supports bidirectional and room-based messaging.
- Polling: Wasteful and latency-prone; the user explicitly chose WebSockets.

---

## R-007: Next.js Control Panel — App Router with Server Components

**Decision**: Use Next.js ≥ 14 with App Router. All pages default to Server Components. Tailwind CSS for styling (user-specified). `@tanstack/react-query` for client-side data synchronization; Server Actions for mutations. Shadcn/ui for the component library.

**Rationale**: User explicitly specified App Router + Tailwind CSS + React Query/Server Actions. Constitution Principle IV mandates RSC-first. Shadcn/ui is built on Radix primitives and integrates natively with Tailwind. React Query handles cache invalidation and optimistic updates for admin workflows.

**Alternatives considered**:
- Pages Router: Legacy; does not support Server Components.
- SWR instead of React Query: React Query has richer features for mutations, optimistic updates, and devtools.
- Chakra UI / MUI: Not Tailwind-native; Shadcn/ui is purpose-built for Tailwind.

---

## R-008: File Upload Strategy (Visa Documents)

**Decision**: Use `@nestjs/platform-express` with Multer for file uploads. Files are stored in an S3-compatible object store (AWS S3 or MinIO for local dev). Presigned URLs are used for secure document viewing in the control panel.

**Rationale**: Multer is the standard NestJS file upload middleware. S3-compatible storage decouples file storage from the application server, supports CDN integration, and scales independently. Presigned URLs prevent unauthorized access to sensitive documents (passport scans).

**Alternatives considered**:
- Local filesystem storage: Not scalable, not suitable for multi-instance deployments.
- Database BLOBs: Inefficient for 5 MB files; bloats the database.

---

## R-009: Monorepo Structure with pnpm Workspaces

**Decision**: Use a pnpm workspace monorepo with two primary packages: `apps/api` (NestJS backend) and `apps/dashboard` (Next.js control panel). Shared code (DTOs, types, constants) resides in `packages/shared`.

**Rationale**: Constitution mandates pnpm workspaces. A monorepo enables shared TypeScript types between backend and frontend, unified linting/formatting, and atomic commits across both apps.

**Alternatives considered**:
- Separate repositories: Complicates type sharing and versioning.
- Turborepo: Good but adds complexity; pnpm workspaces with basic scripts suffice for two apps + one shared package.

---

## R-010: Internationalization (i18n)

**Decision**: Backend returns data in the language stored in the database (Arabic/English content fields). The control panel uses `next-intl` for UI string localization with Arabic (ar) and English (en) locales. RTL layout is handled via Tailwind's `rtl:` variant.

**Rationale**: The spec assumes Arabic and English language support for the Saudi market. `next-intl` integrates cleanly with App Router and Server Components. Tailwind's RTL support avoids manual CSS duplication.

**Alternatives considered**:
- react-i18next: Works but requires more client-side boilerplate; `next-intl` is purpose-built for Next.js App Router.
- No i18n in v1: The Saudi market mandate makes Arabic support a core requirement, not optional.
