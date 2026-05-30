# Tasks: Integrated Travel Platform — Backend & Control Panel

**Input**: Design documents from `/specs/001-travel-platform-backend/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — the constitution mandates testing discipline (Principle VII).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `apps/api/src/`
- **Control Panel**: `apps/dashboard/src/`
- **Shared**: `packages/shared/src/`
- **Tests (backend)**: Co-located `.spec.ts` files + `apps/api/test/` for e2e
- **Tests (control panel)**: Co-located `.test.tsx` files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo, install dependencies, configure tooling.

- [x] T001 Initialize pnpm workspace with `pnpm-workspace.yaml` defining `apps/*` and `packages/*` at repository root
- [x] T002 Create `packages/shared/` package with `package.json`, `tsconfig.json`, and `src/index.ts`
- [x] T003 [P] Create shared TypeScript enums in `packages/shared/src/types/enums.ts` (UserRole, BookingStatus, CabinClass, PassengerType, VisaStatus, DocumentType, ValidationStatus, PaymentMethod, PaymentStatus, BookingType, RefundStatus, NotificationType, Locale)
- [x] T004 [P] Create shared TypeScript type interfaces in `packages/shared/src/types/entities.ts` for all 12 entities from data-model.md
- [x] T005 [P] Create shared constants in `packages/shared/src/constants/index.ts` (booking reference prefixes, file size limits, supported currencies)
- [x] T006 Initialize NestJS application in `apps/api/` with `nest-cli.json`, `tsconfig.json`, `package.json`, and `src/main.ts`
- [x] T007 Initialize Next.js application in `apps/dashboard/` with App Router, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, and `package.json`
- [x] T008 [P] Create root `tsconfig.base.json` with strict mode, `noUncheckedIndexedAccess`, and project references
- [x] T009 [P] Create root `.eslintrc.js` with shared ESLint config for both apps
- [x] T010 [P] Create root `.prettierrc` with shared Prettier config
- [x] T011 [P] Create `docker-compose.yml` at repository root with PostgreSQL 15, Redis 7, and MinIO services
- [x] T012 [P] Create `.gitignore` at repository root covering node_modules, .env, dist, .next, prisma generated client
- [x] T013 [P] Create `apps/api/.env.example` with all required environment variables from quickstart.md
- [x] T014 [P] Create `apps/dashboard/.env.example` with all required environment variables from quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T015 Create Prisma schema in `apps/api/prisma/schema.prisma` with all 12 entities, enums, relations, and indexes from data-model.md
- [x] T016 Generate initial Prisma migration by running `pnpm prisma migrate dev --name init` in `apps/api/`
- [x] T017 Create Prisma seed script in `apps/api/prisma/seed.ts` with default admin users (super-admin, booking-agent, visa-reviewer, finance-viewer) and sample traveler from quickstart.md
- [x] T018 Create `PrismaModule` as a global module in `apps/api/src/prisma/prisma.module.ts` and `prisma.service.ts`
- [x] T019 [P] Create global `ValidationPipe` configuration in `apps/api/src/common/pipes/validation.pipe.ts` with whitelist, forbidNonWhitelisted, and transform enabled
- [x] T020 [P] Create `HttpExceptionFilter` in `apps/api/src/common/filters/http-exception.filter.ts` for standardized error responses
- [x] T021 [P] Create `TransformInterceptor` in `apps/api/src/common/interceptors/transform.interceptor.ts` for consistent response wrapping
- [x] T022 [P] Create `LoggingInterceptor` in `apps/api/src/common/interceptors/logging.interceptor.ts`
- [x] T023 [P] Create shared pagination DTOs in `apps/api/src/common/dto/pagination.dto.ts` (PaginationQueryDto, PaginatedResponseDto)
- [x] T024 Create `@Roles()` decorator in `apps/api/src/common/decorators/roles.decorator.ts`
- [x] T025 [P] Create `@Public()` decorator in `apps/api/src/common/decorators/public.decorator.ts` to skip auth on specific endpoints
- [x] T026 [P] Create `@CurrentUser()` parameter decorator in `apps/api/src/common/decorators/current-user.decorator.ts`
- [x] T027 Create `AuthModule` in `apps/api/src/auth/auth.module.ts` with Passport JWT strategy registration
- [x] T028 Create `JwtStrategy` in `apps/api/src/auth/strategies/jwt.strategy.ts` for access token validation
- [x] T029 Create `JwtRefreshStrategy` in `apps/api/src/auth/strategies/jwt-refresh.strategy.ts` for refresh token validation
- [x] T030 Create `JwtAuthGuard` in `apps/api/src/common/guards/jwt-auth.guard.ts` that respects `@Public()` decorator
- [x] T031 Create `RolesGuard` in `apps/api/src/common/guards/roles.guard.ts` with deny-by-default when `@Roles()` is present on a protected route
- [x] T032 Create `AuthService` in `apps/api/src/auth/auth.service.ts` with register, login, refresh, logout, validateUser, hashPassword, and comparePassword methods
- [x] T033 Create auth DTOs in `apps/api/src/auth/dto/` — `register.dto.ts`, `login.dto.ts`, `refresh-token.dto.ts`, `auth-response.dto.ts`
- [x] T034 Create `AuthController` in `apps/api/src/auth/auth.controller.ts` with POST /register, POST /login, POST /refresh, POST /logout endpoints per auth-api.md contract
- [x] T035 Register global guards (JwtAuthGuard, RolesGuard), pipes (ValidationPipe), filters (HttpExceptionFilter), and interceptors in `apps/api/src/app.module.ts`
- [x] T036 Create `AuthService` unit tests in `apps/api/src/auth/auth.service.spec.ts` (register, login, refresh, password hashing)
- [x] T037 Create auth e2e tests in `apps/api/test/auth.e2e-spec.ts` (register flow, login flow, refresh flow, protected route access, role-based access)
- [x] T038 Create `apps/dashboard/src/lib/api.ts` — fetch wrapper with base URL, auth header injection, token refresh interceptor, and error handling
- [x] T039 Create `apps/dashboard/src/lib/auth.ts` — auth helpers for storing/reading JWT from HTTP-only cookies, middleware for route protection
- [x] T040 Create `apps/dashboard/src/providers/query-provider.tsx` — React Query provider with default options (client component)
- [x] T041 Create root layout in `apps/dashboard/src/app/layout.tsx` — Server Component with HTML lang, Tailwind setup, font loading (Inter), QueryProvider, and ThemeProvider
- [x] T042 Create Shadcn/ui initial setup — install and configure `components.json`, add core primitives (Button, Input, Card, Dialog, Table, Badge, Skeleton, DropdownMenu, Sheet) to `apps/dashboard/src/components/ui/`
- [x] T043 Create design token system in `apps/dashboard/src/app/globals.css` — colors, spacing, border-radii, shadows, and typography scales per constitution Principle VI
- [x] T044 Create sidebar navigation component in `apps/dashboard/src/components/layout/sidebar.tsx` with collapsible menu, route links (Dashboard, Flights, Hotels, Visas, Reports, Settings), and Lucide icons
- [x] T045 Create header component in `apps/dashboard/src/components/layout/header.tsx` with breadcrumbs, user menu, and notification bell
- [x] T046 Create login page in `apps/dashboard/src/app/(auth)/login/page.tsx` with email/password form, validation, and API integration
- [x] T047 Create auth layout in `apps/dashboard/src/app/(auth)/layout.tsx` — centered card layout without sidebar
- [x] T048 Create Next.js middleware in `apps/dashboard/src/middleware.ts` for route protection (redirect to /login if no auth cookie)
- [x] T049 [P] Create `apps/dashboard/src/messages/en.json` and `apps/dashboard/src/messages/ar.json` with initial i18n strings for common UI elements
- [x] T050 [P] Configure `next-intl` in `apps/dashboard/next.config.ts` and create i18n provider setup

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Flight Search & Booking (Priority: P1) 🎯 MVP

**Goal**: Travelers can search for flights, compare options, book with payment, and receive an e-ticket confirmation.

**Independent Test**: Search for a round-trip flight, select the cheapest option, complete booking with payment, verify confirmation and e-ticket.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T051 [P] [US1] Create `FlightsService` unit tests in `apps/api/src/flights/flights.service.spec.ts` (search, compare, book, cancel, get, list)
- [ ] T052 [P] [US1] Create flights e2e tests in `apps/api/test/flights.e2e-spec.ts` (search endpoint, compare endpoint, booking flow, cancellation flow, auth checks)

### Implementation for User Story 1

- [ ] T053 [P] [US1] Create `FlightProviderInterface` in `apps/api/src/flights/providers/flight-provider.interface.ts` defining search, getFlightDetails, and holdSeat methods
- [ ] T054 [P] [US1] Create `MockFlightProvider` in `apps/api/src/flights/providers/mock-flight.provider.ts` with seed data for Riyadh–Istanbul, Jeddah–Cairo, and Riyadh–Dubai routes
- [ ] T055 [US1] Create flight search DTOs in `apps/api/src/flights/dto/search-flights.dto.ts` — SearchFlightsQueryDto with class-validator decorators for origin, destination, dates, passengers, cabinClass
- [ ] T056 [P] [US1] Create `CompareFlightsDto` in `apps/api/src/flights/dto/compare-flights.dto.ts` with array validation (max 3 IDs)
- [ ] T057 [P] [US1] Create `BookFlightDto` in `apps/api/src/flights/dto/book-flight.dto.ts` with nested passenger validation using class-validator
- [ ] T058 [P] [US1] Create flight response DTOs in `apps/api/src/flights/dto/flight-response.dto.ts` — FlightSearchResultDto, FlightBookingResponseDto, FlightBookingDetailDto
- [ ] T059 [US1] Create `FlightsService` in `apps/api/src/flights/flights.service.ts` with search, compare, bookFlight, getBooking, listBookings, cancelBooking methods using Prisma and FlightProviderInterface
- [ ] T060 [US1] Create `FlightsController` in `apps/api/src/flights/flights.controller.ts` implementing all endpoints from flights-api.md contract (GET /search, POST /compare, POST /book, GET /:id, GET /, PATCH /:id/cancel)
- [ ] T061 [US1] Create `FlightsModule` in `apps/api/src/flights/flights.module.ts` registering controller, service, and mock provider
- [ ] T062 [US1] Create `PaymentGatewayInterface` in `apps/api/src/payments/gateways/payment-gateway.interface.ts` defining createPayment, verifyPayment, refundPayment methods
- [ ] T063 [US1] Create `MoyasarGateway` in `apps/api/src/payments/gateways/moyasar.gateway.ts` implementing the PaymentGatewayInterface (mock implementation for dev)
- [ ] T064 [US1] Create payment DTOs in `apps/api/src/payments/dto/` — `create-payment.dto.ts`, `payment-response.dto.ts`, `refund.dto.ts`
- [ ] T065 [US1] Create `PaymentsService` in `apps/api/src/payments/payments.service.ts` with createPayment, handleWebhook, getPayment, initiateRefund methods
- [ ] T066 [US1] Create `PaymentsController` in `apps/api/src/payments/payments.controller.ts` with POST /webhook (public), GET /:id, POST /:id/refund endpoints per payments-admin-notifications-api.md
- [ ] T067 [US1] Create `PaymentsModule` in `apps/api/src/payments/payments.module.ts` registering services and Moyasar gateway
- [ ] T068 [US1] Wire payment flow into FlightsService.bookFlight — create Payment record, generate Moyasar payment URL, return in booking response
- [ ] T069 [US1] Implement payment webhook handler to update Payment status → update FlightBooking status to CONFIRMED on success, generate eTicketRef

**Checkpoint**: At this point, User Story 1 (Flight Booking) should be fully functional and testable independently via API.

---

## Phase 4: User Story 2 — Hotel Search & Booking (Priority: P1)

**Goal**: Travelers can search for hotels, view room details and reviews, book rooms with payment, and receive confirmation.

**Independent Test**: Search for hotels in Makkah, browse rooms and reviews, book a room, complete payment, verify confirmation.

### Tests for User Story 2 ⚠️

- [ ] T070 [P] [US2] Create `HotelsService` unit tests in `apps/api/src/hotels/hotels.service.spec.ts` (search, getDetail, checkAvailability, book, cancel)
- [ ] T071 [P] [US2] Create `ReviewsService` unit tests in `apps/api/src/hotels/reviews.service.spec.ts` (create, list)
- [ ] T072 [P] [US2] Create hotels e2e tests in `apps/api/test/hotels.e2e-spec.ts` (search, detail, availability, booking flow, review submission)

### Implementation for User Story 2

- [ ] T073 [P] [US2] Create `HotelProviderInterface` in `apps/api/src/hotels/providers/hotel-provider.interface.ts` defining search, getHotelDetails, checkAvailability methods
- [ ] T074 [P] [US2] Create `MockHotelProvider` in `apps/api/src/hotels/providers/mock-hotel.provider.ts` with seed data for hotels in Makkah, Madinah, and Riyadh
- [ ] T075 [US2] Create hotel search DTOs in `apps/api/src/hotels/dto/search-hotels.dto.ts` — SearchHotelsQueryDto with city, dates, guests, minStars, maxPrice
- [ ] T076 [P] [US2] Create `BookHotelDto` in `apps/api/src/hotels/dto/book-hotel.dto.ts` with hotelId, roomId, dates, guestCount validation
- [ ] T077 [P] [US2] Create `CreateReviewDto` in `apps/api/src/hotels/dto/create-review.dto.ts` with rating (1–5), title, body validation
- [ ] T078 [P] [US2] Create hotel response DTOs in `apps/api/src/hotels/dto/hotel-response.dto.ts` — HotelListItemDto, HotelDetailDto, RoomDto, RoomAvailabilityDto, HotelBookingResponseDto
- [ ] T079 [US2] Create `HotelsService` in `apps/api/src/hotels/hotels.service.ts` with search, getHotelDetail, listBookings, getBooking, cancelBooking methods
- [ ] T080 [US2] Create `RoomsService` in `apps/api/src/hotels/rooms.service.ts` with checkAvailability, bookRoom methods
- [ ] T081 [US2] Create `ReviewsService` in `apps/api/src/hotels/reviews.service.ts` with createReview, getReviewsByHotel methods
- [ ] T082 [US2] Create `HotelsController` in `apps/api/src/hotels/hotels.controller.ts` implementing all endpoints from hotels-api.md contract
- [ ] T083 [US2] Create `HotelsModule` in `apps/api/src/hotels/hotels.module.ts` registering all services and mock provider
- [ ] T084 [US2] Wire payment flow into RoomsService.bookRoom — create Payment, generate payment URL, return in booking response (reuses PaymentsModule)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 — Umrah Visa Application (Priority: P1)

**Goal**: Travelers can submit visa applications with document uploads, track status, and receive notifications on status changes.

**Independent Test**: Submit visa application with passport scan and photo, verify document validation, track status from pending through approved/rejected, confirm notifications.

### Tests for User Story 3 ⚠️

- [ ] T085 [P] [US3] Create `VisasService` unit tests in `apps/api/src/visas/visas.service.spec.ts` (apply, getApplication, listApplications, validateDocuments)
- [ ] T086 [P] [US3] Create `DocumentsService` unit tests in `apps/api/src/visas/documents.service.spec.ts` (upload, validate, getPresignedUrl)
- [ ] T087 [P] [US3] Create visas e2e tests in `apps/api/test/visas.e2e-spec.ts` (application submission, document upload, status tracking, admin review flow)

### Implementation for User Story 3

- [ ] T088 [P] [US3] Create S3 configuration module in `apps/api/src/common/s3/s3.module.ts` and `s3.service.ts` for MinIO/S3 operations (upload, getPresignedUrl, delete)
- [ ] T089 [US3] Create visa application DTOs in `apps/api/src/visas/dto/` — `apply-visa.dto.ts` (fullName, passportNumber, nationality, dateOfBirth), `visa-response.dto.ts`, `review-visa.dto.ts`
- [ ] T090 [US3] Create `DocumentsService` in `apps/api/src/visas/documents.service.ts` with uploadDocument (Multer → S3), validateDocument (format, size, basic checks), getPresignedUrl methods
- [ ] T091 [US3] Create `VisasService` in `apps/api/src/visas/visas.service.ts` with applyForVisa, getApplication, listMyApplications, listAdminQueue, reviewApplication methods
- [ ] T092 [US3] Create `MaqamIntegrationService` in `apps/api/src/visas/maqam/maqam-integration.service.ts` with submitToMaqam, pollStatus methods (mock implementation for dev)
- [ ] T093 [US3] Create `MaqamProcessor` in `apps/api/src/visas/maqam/maqam.processor.ts` — BullMQ processor for queue-based Maqam submissions with exponential backoff retry
- [ ] T094 [US3] Create `VisasController` in `apps/api/src/visas/visas.controller.ts` implementing all endpoints from visas-api.md (POST /apply with Multer file upload, GET /my-applications, GET /:id, GET /admin/queue, PATCH /admin/:id/review, POST /admin/:id/submit-to-maqam)
- [ ] T095 [US3] Create `VisasModule` in `apps/api/src/visas/visas.module.ts` registering services, BullMQ queue (visa-maqam-queue), and S3Module
- [ ] T096 [US3] Create `NotificationsService` in `apps/api/src/notifications/notifications.service.ts` with createNotification, getUserNotifications, markAsRead, markAllAsRead methods
- [ ] T097 [US3] Create `EmailService` in `apps/api/src/notifications/email.service.ts` with sendVisaStatusUpdate, sendBookingConfirmation, sendBookingCancellation methods using Nodemailer
- [ ] T098 [US3] Create `NotificationsGateway` (WebSocket) in `apps/api/src/notifications/notifications.gateway.ts` with Socket.IO — JWT auth on handshake, per-user rooms, emit events for visa:statusChanged, booking:confirmed, booking:cancelled, notification:new
- [ ] T099 [US3] Create `NotificationsController` in `apps/api/src/notifications/notifications.controller.ts` with GET /, PATCH /:id/read, PATCH /read-all endpoints
- [ ] T100 [US3] Create notification DTOs in `apps/api/src/notifications/dto/` — `notification-response.dto.ts`, `notification-query.dto.ts`
- [ ] T101 [US3] Create `NotificationsModule` in `apps/api/src/notifications/notifications.module.ts` registering service, gateway, email service, and controller
- [ ] T102 [US3] Wire notifications into VisasService — emit WebSocket events + send emails on visa status changes (pending → under_review → approved/rejected → maqam result)

**Checkpoint**: All P1 user stories should now be independently functional via API.

---

## Phase 6: User Story 4 — Control Panel: Booking Management (Priority: P2)

**Goal**: Admins can view dashboard summaries, search/filter bookings, and take actions (cancel/modify) from the control panel.

**Independent Test**: Log into control panel, verify dashboard shows booking counts, search for a booking by reference, view details, cancel a booking.

### Tests for User Story 4 ⚠️

- [ ] T103 [P] [US4] Create dashboard component tests in `apps/dashboard/src/components/dashboard/summary-card.test.tsx` and `status-badge.test.tsx`
- [ ] T104 [P] [US4] Create booking table component test in `apps/dashboard/src/components/bookings/booking-table.test.tsx`

### Implementation for User Story 4

- [ ] T105 [US4] Create `DashboardController` in `apps/api/src/admin/dashboard.controller.ts` with GET /admin/dashboard/summary endpoint per payments-admin-notifications-api.md
- [ ] T106 [US4] Create `DashboardService` in `apps/api/src/admin/dashboard.service.ts` with getSummary method aggregating flight, hotel, and visa counts from Prisma
- [ ] T107 [US4] Create `AdminModule` in `apps/api/src/admin/admin.module.ts` registering dashboard and reports controllers/services
- [ ] T108 [US4] Create `SummaryCard` component in `apps/dashboard/src/components/dashboard/summary-card.tsx` — displays metric title, count, trend indicator, and status breakdown
- [ ] T109 [P] [US4] Create `StatusBadge` component in `apps/dashboard/src/components/shared/status-badge.tsx` — color-coded badge for booking/visa statuses
- [ ] T110 [P] [US4] Create `DataTable` component in `apps/dashboard/src/components/shared/data-table.tsx` — reusable sortable, filterable table with pagination using Shadcn/ui Table
- [ ] T111 [P] [US4] Create `SearchInput` component in `apps/dashboard/src/components/shared/search-input.tsx` with debounced search
- [ ] T112 [US4] Create `useBookings` React Query hook in `apps/dashboard/src/hooks/use-bookings.ts` (listFlightBookings, listHotelBookings, getBooking, cancelBooking)
- [ ] T113 [US4] Create dashboard page in `apps/dashboard/src/app/page.tsx` — Server Component fetching summary data, rendering SummaryCards for flights, hotels, and visas
- [ ] T114 [US4] Create `apps/dashboard/src/app/loading.tsx` with skeleton loaders for dashboard cards
- [ ] T115 [US4] Create `apps/dashboard/src/app/error.tsx` with error boundary UI
- [ ] T116 [US4] Create flight bookings list page in `apps/dashboard/src/app/flights/page.tsx` — Server Component with DataTable, search, status filter, and pagination
- [ ] T117 [US4] Create flight booking detail page in `apps/dashboard/src/app/flights/[id]/page.tsx` — Server Component showing booking details, passenger list, payment info, cancel button
- [ ] T118 [US4] Create hotel bookings list page in `apps/dashboard/src/app/hotels/page.tsx` — Server Component with DataTable, search, and filters
- [ ] T119 [US4] Create hotel booking detail page in `apps/dashboard/src/app/hotels/[id]/page.tsx` — Server Component with booking details, hotel info, payment info, cancel button
- [ ] T120 [US4] Create cancel booking dialog component in `apps/dashboard/src/components/bookings/cancel-dialog.tsx` — client component with reason input and confirmation (uses Server Action)
- [ ] T121 [US4] Create bookings loading and error boundaries in `apps/dashboard/src/app/flights/loading.tsx`, `apps/dashboard/src/app/flights/error.tsx`, `apps/dashboard/src/app/hotels/loading.tsx`, `apps/dashboard/src/app/hotels/error.tsx`

**Checkpoint**: At this point, User Story 4 (Booking Management dashboard) should be fully functional.

---

## Phase 7: User Story 5 — Control Panel: Financial Reports (Priority: P2)

**Goal**: Admins can view revenue summaries, filter transactions, and export reports as CSV/PDF.

**Independent Test**: Navigate to reports section, generate a monthly report filtered by flights, verify totals, export as CSV.

### Tests for User Story 5 ⚠️

- [ ] T122 [P] [US5] Create `ReportsService` unit tests in `apps/api/src/admin/reports.service.spec.ts` (generateReport, exportCsv, exportPdf)
- [ ] T123 [P] [US5] Create report chart component test in `apps/dashboard/src/components/reports/report-chart.test.tsx`

### Implementation for User Story 5

- [ ] T124 [US5] Create `ReportsService` in `apps/api/src/admin/reports.service.ts` with generateFinancialReport, exportAsCsv, exportAsPdf methods using Prisma aggregations
- [ ] T125 [US5] Create report DTOs in `apps/api/src/admin/dto/` — `financial-report-query.dto.ts` (from, to, serviceType, paymentStatus, page, limit), `financial-report-response.dto.ts`
- [ ] T126 [US5] Create `ReportsController` in `apps/api/src/admin/reports.controller.ts` with GET /admin/reports/financial and GET /admin/reports/financial/export endpoints
- [ ] T127 [US5] Create `useReports` React Query hook in `apps/dashboard/src/hooks/use-reports.ts` (getFinancialReport, exportReport)
- [ ] T128 [US5] Create `ReportChart` component in `apps/dashboard/src/components/reports/report-chart.tsx` — client component with revenue breakdown visualization (bar/pie chart)
- [ ] T129 [US5] Create `ExportButton` component in `apps/dashboard/src/components/reports/export-button.tsx` — client component with CSV/PDF format selector and download trigger
- [ ] T130 [US5] Create `ReportFilters` component in `apps/dashboard/src/components/reports/report-filters.tsx` — client component with date range picker, service type select, payment status select
- [ ] T131 [US5] Create reports page in `apps/dashboard/src/app/reports/page.tsx` — Server Component with summary cards, ReportChart, transaction DataTable, ReportFilters, and ExportButton
- [ ] T132 [US5] Create `apps/dashboard/src/app/reports/loading.tsx` and `apps/dashboard/src/app/reports/error.tsx`

**Checkpoint**: At this point, User Stories 4 AND 5 (dashboard + reports) should both work independently.

---

## Phase 8: User Story 6 — Control Panel: Umrah Visa Application Review (Priority: P2)

**Goal**: Admins can review pending visa applications, view documents inline, and approve/reject with notes triggering Maqam integration.

**Independent Test**: View visa queue, open application, review documents, approve it, verify Maqam integration is triggered.

### Tests for User Story 6 ⚠️

- [ ] T133 [P] [US6] Create visa queue component test in `apps/dashboard/src/components/visas/visa-queue.test.tsx`
- [ ] T134 [P] [US6] Create document viewer component test in `apps/dashboard/src/components/visas/document-viewer.test.tsx`

### Implementation for User Story 6

- [ ] T135 [US6] Create `useVisas` React Query hook in `apps/dashboard/src/hooks/use-visas.ts` (listQueue, getApplication, reviewApplication, submitToMaqam)
- [ ] T136 [US6] Create `VisaQueue` component in `apps/dashboard/src/components/visas/visa-queue.tsx` — DataTable showing pending applications with applicant name, submission date, document status, and status badge
- [ ] T137 [US6] Create `DocumentViewer` component in `apps/dashboard/src/components/visas/document-viewer.tsx` — client component displaying passport scan and personal photo inline with zoom capability, using presigned URLs
- [ ] T138 [US6] Create `ReviewActionPanel` component in `apps/dashboard/src/components/visas/review-action-panel.tsx` — client component with Approve/Reject buttons, notes textarea, rejection reason field, and confirmation dialog
- [ ] T139 [US6] Create visa queue page in `apps/dashboard/src/app/visas/page.tsx` — Server Component with VisaQueue table, status filter, and search
- [ ] T140 [US6] Create visa detail/review page in `apps/dashboard/src/app/visas/[id]/page.tsx` — Server Component showing applicant info, DocumentViewer, and ReviewActionPanel
- [ ] T141 [US6] Create `apps/dashboard/src/app/visas/loading.tsx` and `apps/dashboard/src/app/visas/error.tsx`
- [ ] T142 [US6] Create WebSocket integration in `apps/dashboard/src/providers/socket-provider.tsx` — client component connecting to notifications namespace, subscribing to visa:statusChanged events for real-time queue updates
- [ ] T143 [US6] Create `useNotifications` hook in `apps/dashboard/src/hooks/use-notifications.ts` with WebSocket event listeners for real-time notification updates in the header bell

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T144 [P] Create Swagger/OpenAPI documentation setup in `apps/api/src/main.ts` using `@nestjs/swagger` with API prefix `/api/docs`
- [ ] T145 [P] Create health check endpoint in `apps/api/src/app.controller.ts` — GET /api/v1/health returning DB and Redis connectivity status
- [ ] T146 [P] Add rate limiting middleware using `@nestjs/throttler` in `apps/api/src/app.module.ts` for auth endpoints (login, register)
- [ ] T147 [P] Add CORS configuration in `apps/api/src/main.ts` allowing dashboard origin
- [ ] T148 [P] Create settings page in `apps/dashboard/src/app/settings/page.tsx` — Server Component with user profile, language switcher (AR/EN), and password change form
- [ ] T149 Code cleanup — remove all TODO comments, ensure consistent naming conventions across both apps
- [ ] T150 [P] Create `README.md` at repository root with project overview, architecture diagram, setup instructions (reference quickstart.md), and contribution guidelines
- [ ] T151 [P] Add `apps/api/src/auth/guards/` unit tests in `apps/api/src/common/guards/jwt-auth.guard.spec.ts` and `apps/api/src/common/guards/roles.guard.spec.ts`
- [ ] T152 Run full test suite (`pnpm test`) and fix any failures
- [ ] T153 Run quickstart.md validation — follow setup steps from scratch, verify all services start, seed data loads, and default admin login works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–8)**: All depend on Foundational phase completion
  - P1 stories (Phases 3, 4, 5) can proceed in parallel
  - P2 stories (Phases 6, 7, 8) depend on P1 API infrastructure but can proceed in parallel with each other
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 — Flights)**: After Foundational. Creates PaymentsModule reused by US2.
- **User Story 2 (P1 — Hotels)**: After Foundational. Reuses PaymentsModule from US1 — can start in parallel but T084 depends on T067.
- **User Story 3 (P1 — Visas)**: After Foundational. Independent of US1/US2. Creates NotificationsModule reused by US1/US2 retroactively.
- **User Story 4 (P2 — Booking Dashboard)**: After US1 + US2 backends are complete (needs booking data).
- **User Story 5 (P2 — Reports)**: After US1 + US2 backends are complete (needs payment data).
- **User Story 6 (P2 — Visa Review)**: After US3 backend is complete (needs visa data + Maqam integration).

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/DTOs before services
- Services before controllers
- Core implementation before integrations
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003–T005, T008–T014)
- All Foundational tasks marked [P] can run in parallel within Phase 2
- Once Foundational completes:
  - US1 (Flights) and US3 (Visas) can start in parallel
  - US2 (Hotels) can start alongside US1 (minor dependency on PaymentsModule)
- P2 stories (US4, US5, US6) can start in parallel once their P1 dependencies are met

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "T051 Create FlightsService unit tests in apps/api/src/flights/flights.service.spec.ts"
Task: "T052 Create flights e2e tests in apps/api/test/flights.e2e-spec.ts"

# Launch all parallelizable DTOs/interfaces together:
Task: "T053 Create FlightProviderInterface in apps/api/src/flights/providers/flight-provider.interface.ts"
Task: "T054 Create MockFlightProvider in apps/api/src/flights/providers/mock-flight.provider.ts"
Task: "T056 Create CompareFlightsDto"
Task: "T057 Create BookFlightDto"
Task: "T058 Create flight response DTOs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Flight Booking)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Flights) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Hotels) → Test independently → Deploy/Demo
4. Add User Story 3 (Visas) → Test independently → Deploy/Demo
5. Add User Story 4 (Dashboard) → Test independently → Deploy/Demo
6. Add User Story 5 (Reports) → Test independently → Deploy/Demo
7. Add User Story 6 (Visa Review) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Flights)
   - Developer B: User Story 3 (Visas)
   - Developer C: User Story 2 (Hotels, starts slightly after A for PaymentsModule)
3. Once P1 backends complete:
   - Developer A: User Story 4 (Dashboard)
   - Developer B: User Story 6 (Visa Review)
   - Developer C: User Story 5 (Reports)
4. All developers: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
