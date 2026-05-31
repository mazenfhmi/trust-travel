<!--
  Sync Impact Report
  ==================
  Version change: 1.0.0 → 1.1.0
  Bump rationale: MINOR — Added new principle for Payment Processing constraints.

  Modified principles: None

  Added sections:
    - Core Principles (VIII. Payment Processing)

  Removed sections: None

  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ reviewed
    - .specify/templates/spec-template.md        ✅ reviewed
    - .specify/templates/tasks-template.md       ✅ reviewed

  Follow-up TODOs: Implement Bank Transfer payment method and manual confirmation flow in API and dashboard.
-->

# Trust Travel Constitution

## Core Principles

### I. Modular Architecture (NON-NEGOTIABLE)

Every feature MUST be organized as a self-contained NestJS module
(backend) or a co-located route/feature folder (control panel).

- **Backend**: Each domain feature resides in its own NestJS module
  containing its controller, service, DTOs, entities, and guards.
  Modules MUST declare explicit exports; cross-module access MUST go
  through the module's public API (exported services).
- **Control Panel**: Each feature lives in its own route segment under
  `app/` (Next.js App Router). Shared UI primitives reside in a
  top-level `components/` directory; feature-specific components stay
  co-located with their route.
- No circular module dependencies are permitted. If two modules need
  each other, extract the shared concern into a dedicated module.
- Barrel files (`index.ts`) MUST be used at module boundaries to
  control the public surface.

### II. Rigorous Data Validation via DTOs & Class Validators (NON-NEGOTIABLE)

All external data entering the system MUST be validated before it
reaches business logic.

- Every endpoint MUST define explicit DTO classes for request bodies,
  query parameters, and route parameters using `class-validator`
  decorators.
- DTOs MUST use `class-transformer` for type coercion where needed.
- The global `ValidationPipe` MUST be enabled with `whitelist: true`,
  `forbidNonWhitelisted: true`, and `transform: true`.
- Response DTOs (or serialization groups via `class-transformer`) MUST
  be used to control outgoing data shape — never expose raw entities.
- Control panel API calls MUST validate payloads client-side before
  submission using the same DTO schemas (shared or mirrored).

### III. Security — JWT & Role-Based Guards (NON-NEGOTIABLE)

Authentication and authorization MUST follow a layered guard strategy.

- **Authentication**: All protected endpoints MUST be guarded by a
  JWT `AuthGuard` applied globally or at the controller level.
  Tokens MUST be short-lived with a refresh-token rotation strategy.
- **Authorization**: Role-based access MUST be enforced via a custom
  `RolesGuard` that reads a `@Roles()` decorator on handlers.
  The guard MUST deny access by default if no roles are specified on
  a protected route.
- Passwords MUST be hashed with bcrypt (minimum 10 rounds).
- Sensitive configuration (JWT secret, DB credentials) MUST reside in
  environment variables, never committed to source control.
- The control panel MUST use HTTP-only cookies or secure header-based
  token storage — never `localStorage` for auth tokens.

### IV. Server Components First (Control Panel)

The Next.js control panel MUST default to React Server Components
(RSC) for every page and layout.

- Client Components (`'use client'`) MUST only be introduced when
  interactivity is required (event handlers, browser APIs, stateful
  hooks). Each client boundary MUST be pushed as deep as possible in
  the component tree.
- Data fetching MUST happen in Server Components via `async`
  functions — never in `useEffect` on the client unless responding to
  user-initiated actions.
- Server Actions MUST be used for form submissions and mutations
  instead of custom API routes where practical.
- Route-level `loading.tsx` and `error.tsx` files MUST be provided for
  every major route segment.

### V. Performance Optimization

Both backend and control panel MUST meet measurable performance
targets.

- **Backend**: Database queries MUST use pagination (cursor or offset).
  N+1 query patterns are forbidden — use eager loading or
  `QueryBuilder` joins. Caching (in-memory or Redis) MUST be applied
  to read-heavy, infrequently-changing data.
- **Control Panel**: Pages MUST achieve a Lighthouse Performance score
  ≥ 90. Images MUST use `next/image` with appropriate `sizes` and
  lazy loading. Dynamic imports (`next/dynamic`) MUST be used for
  heavy client components not visible on initial render. Bundle size
  MUST be monitored — no single client JS chunk may exceed 200 KB
  gzipped without explicit justification in the Complexity Tracking
  table.
- API responses MUST target < 200 ms p95 latency for standard CRUD
  operations.

### VI. Consistent & Professional User Interface

The control panel MUST present a polished, enterprise-grade
experience.

- A design-token system MUST be established (colors, spacing,
  typography, border-radii, shadows) in a single CSS/theme file.
  All components MUST reference tokens — no hard-coded style values.
- A component library (Shadcn/ui, Radix, or equivalent) MUST be used
  for interactive primitives (buttons, dialogs, tables, forms).
  Custom styling MUST layer on top of the library, not replace it.
- Responsive layout MUST support viewports from 1024 px upward (admin
  panels are desktop-first). Sidebar navigation MUST collapse
  gracefully on narrower breakpoints.
- Loading and error states MUST be visually handled for every
  asynchronous operation — skeleton loaders preferred over spinners.
- Consistent iconography from a single icon set (Lucide, Heroicons, or
  equivalent) MUST be used project-wide.

### VII. Testing Discipline

Code MUST be accompanied by meaningful tests that guard against
regressions.

- **Backend**: Every service method MUST have at least one unit test.
  Every controller endpoint MUST have at least one e2e test using
  NestJS `@nestjs/testing` utilities. Guard and pipe logic MUST be
  unit-tested independently.
- **Control Panel**: Shared UI components MUST have snapshot or
  interaction tests (Vitest + Testing Library). Critical user flows
  (login, CRUD operations) MUST have integration tests.
- Test files MUST be co-located with the module they test (`.spec.ts`
  suffix for backend, `.test.tsx` suffix for control panel).
- CI pipelines MUST run the full test suite — merges to `main` are
  blocked if tests fail.

### VIII. Payment Processing (NON-NEGOTIABLE)

Currently, the only supported payment method is Bank Transfer.
- Payment confirmation MUST NOT be automated.
- All payments MUST be manually reviewed and confirmed from the Control Panel.
- Any other automated gateway (e.g. Moyasar) MUST be disabled or removed until further notice.

## Technology Stack & Constraints

| Layer           | Technology                                  |
|-----------------|---------------------------------------------|
| Backend Runtime | Node.js ≥ 20 LTS                            |
| Backend Framework | NestJS ≥ 10                               |
| ORM             | TypeORM or Prisma (decided per feature)     |
| Database        | PostgreSQL ≥ 15                             |
| Auth            | Passport + JWT strategy                     |
| Validation      | class-validator + class-transformer         |
| Control Panel   | Next.js ≥ 14 (App Router)                   |
| Language        | TypeScript (strict mode) across all layers  |
| Package Manager | pnpm (workspace monorepo)                   |
| Linting         | ESLint + Prettier (shared config at root)   |
| CI/CD           | GitHub Actions (or equivalent)              |

- All code MUST be written in TypeScript with `strict: true` and
  `noUncheckedIndexedAccess: true` enabled in `tsconfig.json`.
- The monorepo MUST use pnpm workspaces with shared `tsconfig`,
  `eslint`, and `prettier` configurations at the root.
- Environment-specific configuration MUST use `.env` files loaded
  through `@nestjs/config` (backend) and `next.config.js` env
  mapping (control panel). `.env` files MUST be listed in
  `.gitignore`.

## Development Workflow & Quality Gates

1. **Branch Strategy**: Feature branches from `main` following
   `<number>-<feature-name>` convention (managed by Spec Kit).
2. **Commit Messages**: Conventional Commits format
   (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
3. **Pull Requests**: Every PR MUST pass linting, type-checking, and
   the full test suite before merge. At least one code review is
   required.
4. **Database Migrations**: Schema changes MUST be expressed as
   versioned migrations — never manual DDL in production.
5. **Dependency Management**: New dependencies MUST be justified in
   the PR description. Prefer well-maintained packages with > 1 000
   weekly downloads and active maintenance.
6. **Documentation**: Every module MUST have a `README.md` or
   doc-comment block explaining its purpose, public API, and usage
   examples.

## Governance

This constitution is the supreme authority for all development
decisions in the Trust Travel project. In case of conflict between
this document and any other guideline, this document prevails.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and migration plan for existing
  code that violates the new rule.
- **Versioning**: Follows semantic versioning — MAJOR for principle
  removals/redefinitions, MINOR for new principles or material
  expansions, PATCH for clarifications.
- **Compliance Review**: Every PR review MUST include a constitution
  compliance check. Violations MUST be resolved before merge unless
  explicitly justified in the Complexity Tracking table.
- **Runtime Guidance**: See `AGENTS.md` for agent-specific development
  guidance and Spec Kit workflow commands.

**Version**: 1.1.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
