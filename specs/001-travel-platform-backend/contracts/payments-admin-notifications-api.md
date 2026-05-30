# API Contracts: Payments & Admin Modules

---

## Payments Module

**Base Path**: `/api/v1/payments`
**Auth**: All endpoints require `Authorization: Bearer <accessToken>`.

### POST /webhook

Moyasar payment webhook callback. **No auth** (verified by signature).

**Request Body**: Moyasar webhook payload (signature verified via `X-Moyasar-Signature` header).

**Response 200**: `{ "received": true }`

**Side Effects**:
- On success: Updates Payment status to COMPLETED, updates booking status to CONFIRMED, sends confirmation notification + email.
- On failure: Updates Payment status to FAILED, booking remains PENDING.

---

### GET /:id

Get payment details. **Auth required (owner or FINANCE_VIEWER+)**.

**Response 200**:
```json
{
  "id": "uuid",
  "reference": "TT-PY-XXXXXX",
  "amount": 2500.00,
  "currency": "SAR",
  "method": "MADA",
  "status": "COMPLETED",
  "bookingType": "FLIGHT",
  "bookingRef": "TT-FL-A1B2C3",
  "gatewayRef": "string",
  "paidAt": "ISO datetime",
  "createdAt": "ISO datetime"
}
```

---

### POST /:id/refund

Initiate a refund. **Auth required (BOOKING_AGENT+)**.

**Request Body**:
```json
{
  "amount": 2500.00,
  "reason": "string (required)"
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "paymentId": "uuid",
  "amount": 2500.00,
  "reason": "string",
  "status": "PENDING",
  "createdAt": "ISO datetime"
}
```

---

## Admin Dashboard Module

**Base Path**: `/api/v1/admin`
**Auth**: All endpoints require BOOKING_AGENT+ role.

### GET /dashboard/summary

Get dashboard summary cards. **Auth required (BOOKING_AGENT+)**.

**Response 200**:
```json
{
  "flights": {
    "total": 1250,
    "confirmed": 980,
    "pending": 150,
    "cancelled": 120
  },
  "hotels": {
    "total": 890,
    "confirmed": 720,
    "pending": 100,
    "cancelled": 70
  },
  "visas": {
    "total": 340,
    "pending": 45,
    "underReview": 12,
    "approved": 250,
    "rejected": 33
  },
  "revenue": {
    "total": 4500000.00,
    "currency": "SAR",
    "thisMonth": 350000.00
  }
}
```

---

### GET /reports/financial

Generate financial report. **Auth required (FINANCE_VIEWER+)**.

**Query Parameters**:
| Param | Type | Required | Notes |
|-------|------|----------|-------|
| from | string (ISO date) | Yes | Start date |
| to | string (ISO date) | Yes | End date |
| serviceType | string | No | FLIGHT, HOTEL, or ALL (default) |
| paymentStatus | string | No | COMPLETED, REFUNDED, or ALL (default) |
| page | int | No | Default 1 |
| limit | int | No | Default 50 |

**Response 200**:
```json
{
  "summary": {
    "totalRevenue": 350000.00,
    "totalTransactions": 425,
    "byService": {
      "FLIGHT": { "revenue": 200000.00, "count": 250 },
      "HOTEL": { "revenue": 150000.00, "count": 175 }
    },
    "currency": "SAR"
  },
  "transactions": {
    "data": [
      {
        "paymentRef": "TT-PY-XXXXXX",
        "bookingRef": "TT-FL-A1B2C3",
        "serviceType": "FLIGHT",
        "amount": 2500.00,
        "currency": "SAR",
        "method": "MADA",
        "status": "COMPLETED",
        "paidAt": "ISO datetime"
      }
    ],
    "meta": { "total": 425, "page": 1, "limit": 50, "totalPages": 9 }
  }
}
```

---

### GET /reports/financial/export

Export financial report. **Auth required (FINANCE_VIEWER+)**.

**Query Parameters**: Same as `/reports/financial` plus `format` (CSV or PDF).

**Response 200**: File download with appropriate Content-Type header.
- CSV: `text/csv`
- PDF: `application/pdf`

---

## Notifications Module

**Base Path**: `/api/v1/notifications`
**Auth**: All endpoints require `Authorization: Bearer <accessToken>`.

### GET /

List user's notifications (paginated).

**Query Parameters**: `page`, `limit`, `unreadOnly` (boolean)

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "VISA_STATUS",
      "title": "Visa Application Updated",
      "body": "Your visa application TT-VS-A1B2C3 has been approved.",
      "data": { "visaRef": "TT-VS-A1B2C3", "status": "APPROVED" },
      "isRead": false,
      "createdAt": "ISO datetime"
    }
  ],
  "meta": { "total": 15, "unread": 3, "page": 1, "limit": 20 }
}
```

### PATCH /:id/read

Mark notification as read.

**Response 200**: Updated notification with `isRead: true`.

### PATCH /read-all

Mark all notifications as read.

**Response 200**: `{ "updated": 3 }`

---

## WebSocket Events

**Namespace**: `/notifications`
**Auth**: JWT token passed via `auth.token` in handshake.

### Server → Client Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `visa:statusChanged` | `{ visaRef, status, reason? }` | Visa status update |
| `booking:confirmed` | `{ bookingRef, type, amount }` | Payment confirmed |
| `booking:cancelled` | `{ bookingRef, type, reason }` | Booking cancelled |
| `notification:new` | Full notification object | Any new notification |

### Client → Server Events

| Event | Payload | Action |
|-------|---------|--------|
| `notification:markRead` | `{ notificationId }` | Mark as read |
