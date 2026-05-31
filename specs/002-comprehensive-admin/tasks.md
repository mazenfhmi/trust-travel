# Tasks: Comprehensive Administration

**Input**: Design documents from `/specs/002-comprehensive-admin/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `audit` module structure in `apps/api/src/audit/`
- [x] T002 Create `admin` dashboard route structure in `apps/dashboard/src/app/admin/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `apps/api/src/prisma/schema.prisma` with `AuditLog` entity
- [x] T004 Run database migrations
- [x] T005 [P] Create `PaginationQueryDto` and `PaginatedResponse` in `apps/api/src/common/dto/pagination.dto.ts`
- [x] T006 [P] Implement `AuditInterceptor` in `apps/api/src/audit/audit.interceptor.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Managing Platform Users and Roles (Priority: P1) 🎯 MVP

**Goal**: Administrators can view, update, and manage all users with server-side pagination.

**Independent Test**: Admins can log into dashboard, view the paginated users table, and successfully edit a user's role.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create Admin Users Controller in `apps/api/src/admin/admin-users.controller.ts`
- [x] T008 [P] [US1] Implement Admin Users Service in `apps/api/src/admin/admin-users.service.ts`
- [x] T009 [P] [US1] Create Users Data Table component in `apps/dashboard/src/components/admin/users-table.tsx`
- [x] T010 [US1] Create Admin Users Page in `apps/dashboard/src/app/admin/users/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Managing Bookings and Services (Priority: P2)

**Goal**: Administrators and Support Agents can view and filter all bookings, and update their statuses.

**Independent Test**: Agents can view a paginated list of bookings and edit a booking status.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create Admin Bookings Controller in `apps/api/src/admin/admin-bookings.controller.ts`
- [x] T012 [P] [US2] Implement Admin Bookings Service in `apps/api/src/admin/admin-bookings.service.ts`
- [x] T013 [P] [US2] Create Bookings Data Table component in `apps/dashboard/src/components/admin/bookings-table.tsx`
- [x] T014 [US2] Create Admin Bookings Page in `apps/dashboard/src/app/admin/bookings/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Accountability and Audit Trails (Priority: P3)

**Goal**: System Administrators can view the audit log of all system mutations.

**Independent Test**: Admin can navigate to Audit Logs page and see the logs generated from their actions in US1 and US2.

### Implementation for User Story 3

- [x] T015 [P] [US3] Create Audit Logs Controller in `apps/api/src/audit/audit.controller.ts`
- [x] T016 [P] [US3] Implement Audit Logs Service in `apps/api/src/audit/audit.service.ts`
- [x] T017 [P] [US3] Create Audit Logs Data Table component in `apps/dashboard/src/components/admin/audit-logs-table.tsx`
- [x] T018 [US3] Create Admin Audit Logs Page in `apps/dashboard/src/app/admin/audit-logs/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Managing Services (Priority: P4)

**Goal**: Administrators can view, update, and manage all services (Flights, Hotels, Visas).

**Independent Test**: Admins can log into dashboard, view the paginated services tables, and successfully edit a service status.

### Implementation for User Story 4

- [x] T019 [P] [US4] Create Admin Services Controller in `apps/api/src/admin/admin-services.controller.ts`
- [x] T020 [P] [US4] Implement Admin Services Service in `apps/api/src/admin/admin-services.service.ts`
- [x] T021 [P] [US4] Create Services Data Table component in `apps/dashboard/src/components/admin/services-table.tsx`
- [x] T022 [US4] Create Admin Services Page in `apps/dashboard/src/app/admin/services/page.tsx`

**Checkpoint**: User Story 4 should be independently functional

---

## Phase 7: User Story 5 - Managing Departments and Roles (Priority: P5)

**Goal**: Administrators can view, update, and manage all departments and their associated roles.

**Independent Test**: Admins can log into dashboard, view the paginated roles table, and successfully update a role's permissions.

### Implementation for User Story 5

- [x] T023 [P] [US5] Create Admin Roles Controller in `apps/api/src/admin/admin-roles.controller.ts`
- [x] T024 [P] [US5] Implement Admin Roles Service in `apps/api/src/admin/admin-roles.service.ts`
- [x] T025 [P] [US5] Create Roles Data Table component in `apps/dashboard/src/components/admin/roles-table.tsx`
- [x] T026 [US5] Create Admin Roles Page in `apps/dashboard/src/app/admin/roles/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T027 [P] Update Dashboard sidebar to include Admin links in `apps/dashboard/src/components/layout/sidebar.tsx`
- [x] T028 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories
