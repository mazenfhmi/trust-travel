# Implementation Plan: Comprehensive Administration

**Branch**: `002-comprehensive-admin` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-comprehensive-admin/spec.md`

## Summary

Build a comprehensive administrative control panel providing full CRUD operations for Users, Bookings, Services, and Departments. This will utilize server-side pagination and sorting, protected by RBAC, with comprehensive audit logging for all mutations.

## Technical Context

**Language/Version**: TypeScript 5+ (Node 20+)

**Primary Dependencies**: NestJS 11, Prisma ORM, Next.js 14, Shadcn UI, React Hook Form

**Storage**: PostgreSQL (Primary Data & Audit Logs)

**Testing**: Jest (Backend), Vitest/Testing Library (Frontend)

**Target Platform**: Web (Desktop-first Admin Dashboard)

**Project Type**: Web Application (Monorepo with Frontend + Backend)

**Performance Goals**: < 500ms p95 for table loads; support > 1M records via offset pagination.

**Constraints**: Immutable audit logs, strict role checks, server components default.

**Scale/Scope**: All core entities, high volume of audit logs expected over time.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Modular Architecture: All logic belongs in respective modules (`AdminModule`, `UsersModule`, `AuditModule`).
- [x] II. Data Validation: Standard class-validator DTOs for pagination (`PaginationQueryDto`).
- [x] III. Security: Custom `RolesGuard` will limit actions to authorized roles.
- [x] IV. Server Components: Admin views will be Server Components.
- [x] V. Performance: Server-side pagination enforced by Prisma and Next.js query params.
- [x] VI. Consistent UI: Re-using Shadcn UI data tables.
- [x] VII. Testing: Full unit and e2e testing required for Admin endpoints.
- [x] VIII. Payment: Unchanged, out of scope.
- [x] IX. Comprehensive Admin & Scalability: Directly satisfies this new principle.

## Project Structure

### Documentation (this feature)

```text
specs/002-comprehensive-admin/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── admin/
│   ├── audit/ (NEW)
│   ├── users/
│   ├── common/dto/
│   └── prisma/schema.prisma

apps/dashboard/
├── src/
│   ├── app/admin/
│   ├── components/ui/data-table/
│   └── hooks/
```

**Structure Decision**: The Monorepo option 2 structure is maintained. Backend adds a new `audit` module and extends `admin` and `users`. Dashboard adds an `admin/` route group with standard Shadcn UI tables.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
