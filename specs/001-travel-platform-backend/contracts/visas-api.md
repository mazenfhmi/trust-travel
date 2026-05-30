# API Contracts: Visas Module

**Base Path**: `/api/v1/visas`
**Auth**: All endpoints require `Authorization: Bearer <accessToken>`.

---

## POST /apply

Submit a new Umrah visa application. **Auth required (TRAVELER)**.

**Content-Type**: `multipart/form-data`

**Form Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| fullName | string | Yes | As on passport |
| passportNumber | string | Yes | |
| nationality | string | Yes | ISO 3166-1 alpha-2 |
| dateOfBirth | string | Yes | YYYY-MM-DD |
| passportScan | file | Yes | JPEG/PNG, max 5 MB |
| personalPhoto | file | Yes | JPEG/PNG, max 5 MB |

**Response 201**:
```json
{
  "id": "uuid",
  "reference": "TT-VS-A1B2C3",
  "status": "PENDING",
  "fullName": "string",
  "documents": [
    { "type": "PASSPORT_SCAN", "validationStatus": "VALID" },
    { "type": "PERSONAL_PHOTO", "validationStatus": "VALID" }
  ],
  "createdAt": "ISO datetime"
}
```

**Response 400**: Document validation failure.
```json
{
  "statusCode": 400,
  "message": "Document validation failed",
  "errors": [
    { "field": "passportScan", "error": "File exceeds 5 MB limit" },
    { "field": "personalPhoto", "error": "Invalid format. Accepted: JPEG, PNG" }
  ]
}
```

---

## GET /my-applications

List traveler's own visa applications. **Auth required (TRAVELER)**.

**Query Parameters**: `page`, `limit`, `status`

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "reference": "TT-VS-A1B2C3",
      "status": "PENDING",
      "fullName": "string",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

## GET /:id

Get visa application details. **Auth required (owner or VISA_REVIEWER+)**.

**Response 200**:
```json
{
  "id": "uuid",
  "reference": "TT-VS-A1B2C3",
  "status": "UNDER_REVIEW",
  "fullName": "string",
  "passportNumber": "string",
  "nationality": "SA",
  "dateOfBirth": "1990-01-15",
  "documents": [
    {
      "id": "uuid",
      "type": "PASSPORT_SCAN",
      "fileName": "passport.jpg",
      "validationStatus": "VALID",
      "downloadUrl": "https://s3.../presigned-url (expires in 15 min)"
    },
    {
      "id": "uuid",
      "type": "PERSONAL_PHOTO",
      "fileName": "photo.png",
      "validationStatus": "VALID",
      "downloadUrl": "https://s3.../presigned-url"
    }
  ],
  "reviewerNotes": "string (admin only)",
  "rejectionReason": "string (if rejected)",
  "maqamReference": "string (if submitted)",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

---

## Admin Endpoints

### GET /admin/queue

List all visa applications for review. **Auth required (VISA_REVIEWER+)**.

**Query Parameters**: `page`, `limit`, `status`, `sortBy` (default: createdAt ASC)

---

### PATCH /admin/:id/review

Approve or reject a visa application. **Auth required (VISA_REVIEWER+)**.

**Request Body**:
```json
{
  "action": "APPROVE | REJECT",
  "notes": "string (optional, internal)",
  "rejectionReason": "string (required if REJECT, shared with applicant)"
}
```

**Response 200**:
```json
{
  "id": "uuid",
  "reference": "TT-VS-A1B2C3",
  "status": "APPROVED",
  "reviewerId": "uuid",
  "reviewerNotes": "string",
  "updatedAt": "ISO datetime"
}
```

**Response 409**: Application already processed.

---

### POST /admin/:id/submit-to-maqam

Manually trigger Maqam submission for an approved application. **Auth required (VISA_REVIEWER+)**.

**Response 202**:
```json
{
  "id": "uuid",
  "status": "SUBMITTED_TO_MAQAM",
  "maqamSubmittedAt": "ISO datetime",
  "message": "Application queued for Maqam submission"
}
```
