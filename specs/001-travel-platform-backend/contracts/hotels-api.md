# API Contracts: Hotels Module

**Base Path**: `/api/v1/hotels`
**Auth**: All endpoints require `Authorization: Bearer <accessToken>` unless noted.

---

## GET /search

Search for available hotels. **Public**.

**Query Parameters**:
| Param | Type | Required | Notes |
|-------|------|----------|-------|
| city | string | Yes | City name (e.g., Makkah) |
| checkIn | string (ISO date) | Yes | YYYY-MM-DD |
| checkOut | string (ISO date) | Yes | YYYY-MM-DD |
| guests | int | No | Default 1 |
| minStars | int | No | 1–5 filter |
| maxPrice | decimal | No | Max price per night in SAR |
| page | int | No | Default 1 |
| limit | int | No | Default 20, max 50 |

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "nameAr": "string",
      "city": "Makkah",
      "starRating": 5,
      "primaryPhoto": "https://s3.../photo.jpg",
      "averageRating": 4.7,
      "reviewCount": 234,
      "startingPrice": {
        "amount": 450.00,
        "currency": "SAR",
        "perNight": true
      },
      "amenities": ["wifi", "pool", "parking"]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## GET /:hotelId

Get hotel details with rooms and reviews. **Public**.

**Response 200**:
```json
{
  "id": "uuid",
  "name": "string",
  "nameAr": "string",
  "city": "Makkah",
  "address": "string",
  "starRating": 5,
  "description": "string",
  "descriptionAr": "string",
  "amenities": ["wifi", "pool", "parking", "restaurant"],
  "photos": ["url1", "url2", "url3"],
  "averageRating": 4.7,
  "reviewCount": 234,
  "rooms": [
    {
      "id": "uuid",
      "type": "Deluxe Double",
      "typeAr": "ديلوكس مزدوج",
      "capacity": 2,
      "pricePerNight": { "amount": 450.00, "currency": "SAR" },
      "photos": ["url1"],
      "available": true
    }
  ],
  "reviews": {
    "data": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Excellent stay",
        "body": "string",
        "author": "Ahmed M.",
        "createdAt": "ISO datetime"
      }
    ],
    "meta": { "total": 234, "page": 1, "limit": 5 }
  }
}
```

---

## GET /:hotelId/rooms/:roomId/availability

Check room availability for dates. **Public**.

**Query Parameters**: `checkIn`, `checkOut`

**Response 200**:
```json
{
  "roomId": "uuid",
  "available": true,
  "totalNights": 3,
  "pricePerNight": 450.00,
  "totalPrice": 1350.00,
  "currency": "SAR"
}
```

---

## POST /book

Create a hotel booking. **Auth required (TRAVELER)**.

**Request Body**:
```json
{
  "hotelId": "uuid",
  "roomId": "uuid",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guestCount": 2,
  "contactEmail": "string"
}
```

**Response 201**:
```json
{
  "bookingId": "uuid",
  "reference": "TT-HT-X1Y2Z3",
  "status": "PENDING",
  "hotel": "Hotel Name",
  "room": "Deluxe Double",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "nights": 3,
  "totalAmount": 1350.00,
  "currency": "SAR",
  "paymentUrl": "https://moyasar.com/pay/..."
}
```

---

## GET /bookings

List hotel bookings (paginated). **Auth required**.

**Query Parameters**: `page`, `limit`, `status`, `from`, `to`

**Response 200**: Same pagination structure as flights.

---

## GET /bookings/:id

Get hotel booking details. **Auth required (owner or BOOKING_AGENT+)**.

---

## PATCH /bookings/:id/cancel

Cancel a hotel booking. **Auth required (owner or BOOKING_AGENT+)**.

**Request Body**: `{ "reason": "string (required)" }`

---

## POST /:hotelId/reviews

Submit a hotel review. **Auth required (TRAVELER, must have completed stay)**.

**Request Body**:
```json
{
  "rating": 5,
  "title": "string (optional)",
  "body": "string (optional)"
}
```

**Response 201**: Created review object.
