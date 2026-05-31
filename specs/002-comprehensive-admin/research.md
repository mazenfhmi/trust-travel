# Research & Technical Decisions

## 1. Audit Logging Strategy

**Context**: Constitution Principle IX requires system activity and critical mutations to be securely logged for auditability.
**Problem**: How do we ensure 100% coverage of administrative actions without massive code duplication?

- **Alternative A: Explicit Service Calls**. Manually call `auditService.log(...)` inside every service mutation.
  - *Pros*: Precise control over the log message.
  - *Cons*: High risk of developer oversight; violates DRY.
- **Alternative B: Prisma Extension**. Intercept all DB writes at the ORM level.
  - *Pros*: Impossible to bypass.
  - *Cons*: Difficult to access the current authenticated user's ID without passing it down through every Prisma call.
- **Alternative C: NestJS Global Interceptor**. Intercept all HTTP requests.
  - *Pros*: Full access to `req.user.id`, `req.method`, `req.url`, and payload. Centralized logic.

**Decision**: **Alternative C (NestJS Global Interceptor)**.
**Rationale**: We will create an `AuditInterceptor` that listens to all `POST`, `PUT`, `PATCH`, and `DELETE` requests under the `/api/v1/admin/*` routes. It will automatically capture the user ID, endpoint, and payload, and write it to an `AuditLog` table. For highly specific business events, we can also expose an `AuditService` for manual logging.

## 2. Server-Side Pagination with Next.js App Router

**Context**: Data tables must efficiently load >1M records (Principle IX).
**Problem**: Client-side pagination (loading all data and paginating in JS) will crash the browser.

- **Alternative A: React Query / Client-Side Fetching**.
  - *Pros*: Smooth transitions without page unloads.
  - *Cons*: Requires building full client-side fetching logic; less SEO-friendly (though irrelevant for Admin); duplicates state.
- **Alternative B: URL-Driven Server Components**.
  - *Pros*: State is stored in the URL (`?page=2&sort=name:asc`). Native to Next.js App Router. Server fetches exactly what is needed.

**Decision**: **Alternative B (URL-Driven Server Components)**.
**Rationale**: The Shadcn UI DataTable will be wrapped in a Client Component that updates the URL search parameters when pagination or sorting changes. The parent Server Component reads `searchParams`, fetches data directly from the API (or DB if monolithic, but we use an API), and passes it down. This guarantees high performance and deep-linkable states.
