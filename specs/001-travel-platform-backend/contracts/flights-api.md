# API Contracts: Flights Module

**Base Path**: `/api/v1/flights`
**Auth**: All endpoints require `Authorization: Bearer <accessToken>` unless noted.

---

## GET /search

Search for available flights. **Public** (no auth required).

**Query Parameters**:
| Param | Type | Required | Notes |
|-------|------|----------|-------|
| origin | string | Yes | IATA code (e.g., RUH) |
| destination | string | Yes | IATA code (e.g., IST) |
| departureDate | string (ISO date) | Yes | YYYY-MM-DD |
| returnDate | string (ISO date) | No | Null for one-way |
| passengers | int | Yes | 1–9 |
| cabinClass | string | No | ECONOMY (default), BUSINESS, FIRST |

**Response 200**:
```json
{
  "results": [
    {
      "id": "string (provider ref)",
      "airline": "string",
      "origin": "RUH",
      "destination": "IST",
      "departureTime": "ISO datetime",
      "arrivalTime": "ISO datetime",
      "duration": "PT5H30M (ISO 8601 duration)",
      "stops": 0,
      "cabinClass": "ECONOMY",
      "price": {
        "amount": 1250.00,
        "currency": "SAR"
      },
      "seatsAvailable": 12
    }
  ],
  "meta": {
    "totalResults": 15,
    "searchId": "uuid"
  }
}
```

**Response 400**: Validation error (missing/invalid params).

---

## POST /compare

Compare up to 3 flights side-by-side. **Public**.

**Request Body**:
```json
{
  "flightIds": ["string", "string", "string"]
}
```

**Response 200**:
```json
{
  "flights": [
    {
      "id": "string",
      "airline": "string",
      "price": { "amount": 1250.00, "currency": "SAR" },
      "duration": "PT5H30M",
      "stops": 0,
      "departureTime": "ISO datetime",
      "arrivalTime": "ISO datetime",
      "cabinClass": "ECONOMY"
    }
  ]
}
```

---

## POST /book

Create a flight booking. **Auth required (TRAVELER)**.

**Request Body**:
```json
{
  "flightId": "string (from search results)",
  "passengers": [
    {
      "firstName": "string",
      "lastName": "string",
      "passportNumber": "string",
      "nationality": "string",
      "dateOfBirth": "YYYY-MM-DD",
      "type": "ADULT|CHILD|INFANT"
    }
  ],
  "contactEmail": "string"
}
```

**Response 201**:
```json
{
  "bookingId": "uuid",
  "reference": "TT-FL-A1B2C3",
  "status": "PENDING",
  "totalAmount": 2500.00,
  "currency": "SAR",
  "paymentUrl": "https://moyasar.com/pay/..."
}
```

**Response 409**: Duplicate booking detected.

---

## GET /:id

Get booking details. **Auth required (owner or BOOKING_AGENT+)**.

**Response 200**:
```json
{
  "id": "uuid",
  "reference": "TT-FL-A1B2C3",
  "status": "CONFIRMED",
  "origin": "RUH",
  "destination": "IST",
  "departureDate": "ISO datetime",
  "returnDate": "ISO datetime",
  "airline": "string",
  "cabinClass": "ECONOMY",
  "passengers": [...],
  "totalAmount": 2500.00,
  "currency": "SAR",
  "eTicketRef": "string",
  "payment": { "status": "COMPLETED", "method": "MADA" },
  "createdAt": "ISO datetime"
}
```

---

## GET /

List bookings (paginated). **Auth required**.
- Travelers see own bookings only.
- BOOKING_AGENT+ sees all.

**Query Parameters**: `page`, `limit`, `status`, `from`, `to`

**Response 200**:
```json
{
  "data": [...],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## PATCH /:id/cancel

Cancel a booking. **Auth required (owner or BOOKING_AGENT+)**.

**Request Body**:
```json
{
  "reason": "string (required)"
}
```

**Response 200**:
```json
{
  "id": "uuid",
  "reference": "TT-FL-A1B2C3",
  "status": "CANCELLED",
  "cancellationReason": "string",
  "refund": {
    "id": "uuid",
    "amount": 2500.00,
    "status": "PENDING"
  }
}
```
