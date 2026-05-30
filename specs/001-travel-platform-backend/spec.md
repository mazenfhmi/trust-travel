# Feature Specification: Integrated Travel Platform — Backend & Control Panel

**Feature Branch**: `001-travel-platform-backend`

**Created**: 2026-05-30

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Flight Search & Booking (Priority: P1)

A traveler visits the platform, searches for flights by entering origin, destination, travel dates, passenger count, and cabin class. The system returns a list of available flights with pricing, airlines, layovers, and duration. The traveler compares options side-by-side, selects a flight, provides passenger details, and proceeds to payment. Upon successful payment the system issues a booking confirmation with a unique reference number and an e-ticket.

**Why this priority**: Flights are the highest-revenue product and the primary entry point for travel customers. Without a working flight booking flow, the platform has no MVP.

**Independent Test**: Search for a round-trip flight from Riyadh to Istanbul, select the cheapest option, complete passenger details, pay, and verify the booking confirmation and e-ticket are received.

**Acceptance Scenarios**:

1. **Given** a traveler enters valid origin, destination, and dates, **When** they submit the search, **Then** the system returns at least one flight result within 5 seconds.
2. **Given** search results are displayed, **When** the traveler selects two flights and clicks "Compare", **Then** a side-by-side comparison shows price, duration, stops, and airline for each.
3. **Given** a traveler selects a flight and fills in passenger details, **When** they proceed to payment and complete it, **Then** the system creates a booking, assigns a unique reference, and sends an e-ticket to the traveler's email.
4. **Given** a payment fails, **When** the payment gateway returns an error, **Then** the booking is not confirmed and the traveler sees a clear error message with retry options.

---

### User Story 2 — Hotel Search & Booking (Priority: P1)

A traveler searches for hotels by city, check-in/check-out dates, room type, and guest count. The system displays available properties with photos, star ratings, amenities, and guest reviews. The traveler views room details, selects a room, and books it through the payment gateway. A booking confirmation with a unique reference is generated.

**Why this priority**: Hotel bookings are the second core revenue stream and often bundled with flight bookings, making them essential for a complete travel platform.

**Independent Test**: Search for hotels in Makkah for a 3-night stay, browse room types and reviews, select a room, complete payment, and verify the booking confirmation is generated.

**Acceptance Scenarios**:

1. **Given** a traveler searches for hotels in a valid city with dates, **When** results load, **Then** each listing shows the hotel name, star rating, starting price, a primary photo, and average review score.
2. **Given** a traveler clicks a hotel listing, **When** the detail page loads, **Then** all room types, amenities, photos, and guest reviews are displayed.
3. **Given** a traveler selects a room and proceeds to checkout, **When** payment succeeds, **Then** a booking confirmation with a unique reference is generated and sent to the traveler's email.
4. **Given** no rooms are available for the selected dates, **When** the traveler searches, **Then** the system displays a clear "No availability" message and suggests alternative dates.

---

### User Story 3 — Umrah Visa Application (Priority: P1)

A traveler initiates an Umrah visa application by providing personal information, uploading required documents (passport scan and personal photo), and submitting the application. The system validates document formats and completeness, sends the application for internal review, integrates with the Maqam platform for processing, and keeps the traveler informed of their application status (pending → accepted / rejected).

**Why this priority**: Umrah visa services are the platform's differentiator in the Saudi travel market and directly integrate with government systems, making them a core feature.

**Independent Test**: Submit a complete Umrah visa application with passport scan and photo, verify the system validates documents, track status changes from "pending" through to "accepted" or "rejected", and confirm notifications are sent at each stage.

**Acceptance Scenarios**:

1. **Given** a traveler starts a visa application, **When** they upload a passport scan and personal photo, **Then** the system validates file format (JPEG/PNG, max 5 MB) and image quality (minimum resolution, clear face detection).
2. **Given** all documents are valid, **When** the traveler submits the application, **Then** the application status is set to "Pending" and the traveler receives a confirmation with an application reference number.
3. **Given** a submitted application, **When** an admin reviews and approves it, **Then** the application is forwarded to the Maqam platform for official processing.
4. **Given** the Maqam platform returns a result, **When** the status changes (accepted or rejected), **Then** the traveler is notified via email and in-app notification with the updated status and any rejection reasons.
5. **Given** a traveler uploads an invalid document (wrong format, corrupted, or below minimum quality), **When** they attempt to submit, **Then** the system blocks submission and provides a specific error message identifying the issue.

---

### User Story 4 — Control Panel: Booking Management (Priority: P2)

An admin logs into the control panel and views a dashboard summarizing active bookings across flights and hotels. They can search, filter, and drill into individual bookings, view booking details, and take actions such as cancellation or modification. The dashboard provides real-time counts and status breakdowns.

**Why this priority**: Operational visibility is essential for business operations but depends on the booking infrastructure from P1 stories being in place.

**Independent Test**: Log into the control panel, verify the dashboard shows booking counts, search for a specific booking by reference number, and confirm the detail view shows all booking information.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they access the control panel dashboard, **Then** they see summary cards for total flights booked, total hotels booked, and total Umrah applications with status breakdowns.
2. **Given** the admin clicks on "Flight Bookings", **When** the list loads, **Then** all bookings are paginated with columns for reference, traveler name, route, date, status, and amount.
3. **Given** the admin searches by booking reference, **When** results return, **Then** matching bookings are displayed within 2 seconds.
4. **Given** the admin views a booking detail, **When** they click "Cancel Booking", **Then** the system prompts for a cancellation reason and processes the cancellation with appropriate refund logic.

---

### User Story 5 — Control Panel: Financial Reports (Priority: P2)

An admin accesses the financial reporting section to view revenue summaries, transaction histories, and payment breakdowns by service type (flights, hotels, visas). Reports can be filtered by date range, service type, and payment status. Export to CSV or PDF is available.

**Why this priority**: Financial reporting is critical for business operations and stakeholder visibility but depends on transactional data from P1 features.

**Independent Test**: Navigate to the financial reports section, generate a revenue report for the current month filtered by flights, verify the totals match expected transaction data, and export the report as CSV.

**Acceptance Scenarios**:

1. **Given** an authenticated admin with finance permissions, **When** they open the financial reports section, **Then** a summary dashboard shows total revenue, total transactions, and revenue by service type for the selected period.
2. **Given** the admin selects a date range and filters by "Hotels", **When** the report generates, **Then** it displays itemized transactions with booking reference, amount, payment method, and status.
3. **Given** a completed report, **When** the admin clicks "Export CSV", **Then** a properly formatted CSV file downloads within 5 seconds.

---

### User Story 6 — Control Panel: Umrah Visa Application Review (Priority: P2)

An admin accesses the visa management section to review pending Umrah applications. They can view submitted documents, approve or reject applications with notes, and trigger the integration with the Maqam platform. The queue is prioritized by submission date and filterable by status.

**Why this priority**: Visa approval is a manual review step that bridges the traveler-facing submission (P1) with government processing. It cannot function without the application submission flow.

**Independent Test**: View the pending visa application queue, open an application, review the submitted documents, approve the application, and verify it is forwarded to the Maqam platform.

**Acceptance Scenarios**:

1. **Given** an authenticated admin with visa management permissions, **When** they access the visa queue, **Then** pending applications are listed in submission-date order with applicant name, submission date, and document status.
2. **Given** the admin opens a pending application, **When** the detail view loads, **Then** the passport scan and personal photo are displayed inline with document validation status.
3. **Given** the admin clicks "Approve", **When** the application is approved, **Then** the system updates the status to "Approved" and initiates the Maqam platform integration.
4. **Given** the admin clicks "Reject", **When** they provide a rejection reason, **Then** the system updates the status to "Rejected" and notifies the applicant with the reason.

---

### Edge Cases

- What happens when the Maqam platform is unreachable during visa submission? The system MUST queue the request and retry automatically, notifying the admin of the delay.
- What happens when a traveler attempts to double-book the same flight? The system MUST detect duplicate bookings and warn the traveler before proceeding.
- What happens when a payment gateway times out? The system MUST not create a confirmed booking and MUST provide the traveler with a way to retry or check payment status.
- What happens when an admin attempts to approve an already-processed visa application? The system MUST prevent duplicate processing and display the current status.
- What happens when uploaded documents exceed size limits? The system MUST reject the upload immediately with a clear file-size error before the form is submitted.
- What happens when the admin session expires during a critical action (e.g., booking cancellation)? The system MUST preserve the action context and resume after re-authentication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow travelers to search for flights by origin, destination, travel dates, passenger count, and cabin class.
- **FR-002**: System MUST return flight search results with pricing, airline, duration, layover information, and availability status.
- **FR-003**: System MUST support side-by-side flight comparison for up to 3 selected flights.
- **FR-004**: System MUST process flight bookings with passenger details and generate a unique booking reference and e-ticket upon successful payment.
- **FR-005**: System MUST allow travelers to search for hotels by city, check-in/check-out dates, room type, and guest count.
- **FR-006**: System MUST display hotel listings with photos, star ratings, room types, amenities, pricing, and guest reviews.
- **FR-007**: System MUST process hotel bookings and generate a unique booking reference upon successful payment.
- **FR-008**: System MUST allow travelers to submit Umrah visa applications with personal information, passport scan, and personal photo uploads.
- **FR-009**: System MUST validate uploaded documents for format (JPEG/PNG), file size (max 5 MB), and minimum quality standards.
- **FR-010**: System MUST track visa application status through a lifecycle of Pending → Under Review → Approved/Rejected.
- **FR-011**: System MUST integrate with the Maqam platform to forward approved visa applications and receive processing results.
- **FR-012**: System MUST notify travelers of visa status changes via email and in-app notifications.
- **FR-013**: System MUST provide an admin control panel with a dashboard summarizing bookings and visa applications.
- **FR-014**: System MUST allow admins to search, filter, view, cancel, and modify bookings.
- **FR-015**: System MUST provide financial reports with filtering by date range, service type, and payment status.
- **FR-016**: System MUST support exporting financial reports as CSV and PDF.
- **FR-017**: System MUST allow authorized admins to review, approve, or reject Umrah visa applications with notes.
- **FR-018**: System MUST enforce role-based access control with distinct roles for travelers, booking agents, visa reviewers, finance viewers, and super-admins.
- **FR-019**: System MUST support payment processing through at least one payment gateway for both flight and hotel bookings.
- **FR-020**: System MUST queue and retry Maqam platform submissions when the external service is unavailable.

### Key Entities

- **Traveler**: Registered user who searches, books, and applies for visas. Key attributes: name, email, phone, nationality, passport details.
- **Flight Booking**: A confirmed flight reservation. Key attributes: booking reference, traveler, flight details (origin, destination, dates, airline), passenger manifest, payment status, e-ticket reference.
- **Hotel Booking**: A confirmed hotel reservation. Key attributes: booking reference, traveler, hotel, room type, check-in/check-out dates, guest count, payment status.
- **Hotel**: A bookable property. Key attributes: name, city, star rating, amenities, photos, average review score.
- **Room**: A bookable unit within a hotel. Key attributes: room type, capacity, price per night, availability.
- **Review**: Guest feedback on a hotel. Key attributes: author, rating, text, date.
- **Visa Application**: An Umrah visa request. Key attributes: application reference, traveler, passport document, personal photo, status (pending/under-review/approved/rejected), Maqam reference, reviewer notes.
- **Payment**: A financial transaction. Key attributes: reference, amount, currency, method, status (pending/completed/failed/refunded), associated booking.
- **Admin User**: A control panel operator. Key attributes: name, email, role (booking-agent, visa-reviewer, finance-viewer, super-admin).
- **Financial Report**: An aggregated view of transactions. Key attributes: period, service type, total revenue, transaction count, export format.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Travelers can complete a flight search and booking in under 5 minutes from search to confirmation.
- **SC-002**: Travelers can complete a hotel search and booking in under 5 minutes from search to confirmation.
- **SC-003**: Travelers can submit a complete Umrah visa application in under 10 minutes, including document uploads.
- **SC-004**: 95% of flight and hotel search results are returned within 3 seconds.
- **SC-005**: Visa application status updates reach the traveler within 1 minute of the status change.
- **SC-006**: Admins can locate any booking by reference number within 2 seconds.
- **SC-007**: Financial reports for a 30-day period generate within 5 seconds.
- **SC-008**: The system supports at least 500 concurrent active users without degradation.
- **SC-009**: The control panel achieves a task-completion rate of 95% for common admin workflows (booking search, visa review, report generation) on first attempt.
- **SC-010**: Zero confirmed bookings are created for failed payments (payment-booking integrity is 100%).

## Assumptions

- Travelers have stable internet connectivity and access to a modern web browser.
- Flight and hotel inventory data is sourced from third-party GDS/aggregator APIs (specific provider TBD during planning).
- The Maqam platform provides a documented API for visa application submission and status polling.
- Payment processing uses a PCI-DSS compliant third-party gateway (e.g., Tap, Moyasar, or HyperPay — specific provider TBD during planning).
- The platform targets the Saudi Arabian market, with Arabic and English language support as a baseline.
- Currency is Saudi Riyal (SAR) as the primary currency, with conversion display for international flights.
- Mobile-responsive traveler experience is expected, but native mobile apps are out of scope for this feature.
- The control panel is desktop-first (1024px+), consistent with the constitution's UI requirements.
- Email is the primary notification channel; SMS and push notifications are out of scope for v1.
- Document validation (passport scan quality, face detection) uses basic format and size checks in v1; advanced AI-based validation is out of scope.
