# API Contracts: Auth Module

**Base Path**: `/api/v1/auth`

---

## POST /register

Register a new traveler account.

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, 1 uppercase, 1 number)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "phone": "string (optional, E.164 format)",
  "locale": "string (optional, default: AR, enum: AR|EN)"
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "TRAVELER",
  "accessToken": "string (JWT)",
  "refreshToken": "string"
}
```

**Response 409**: `{ "message": "Email already registered", "statusCode": 409 }`

---

## POST /login

Authenticate and receive JWT tokens.

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response 200**:
```json
{
  "accessToken": "string (JWT, 15 min TTL)",
  "refreshToken": "string (7 day TTL)",
  "user": {
    "id": "uuid",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "UserRole"
  }
}
```

**Response 401**: `{ "message": "Invalid credentials", "statusCode": 401 }`

---

## POST /refresh

Rotate refresh token and issue new access token.

**Request Body**:
```json
{
  "refreshToken": "string (required)"
}
```

**Response 200**:
```json
{
  "accessToken": "string (new JWT)",
  "refreshToken": "string (new refresh token)"
}
```

**Response 401**: `{ "message": "Invalid or expired refresh token", "statusCode": 401 }`

---

## POST /logout

Invalidate the current refresh token.

**Headers**: `Authorization: Bearer <accessToken>`

**Response 200**: `{ "message": "Logged out successfully" }`
