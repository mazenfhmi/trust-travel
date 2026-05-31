# Data Model: Comprehensive Administration

## 1. AuditLog Entity

To satisfy Principle IX and track administrative actions.

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  userId    String   // Foreign key to User
  user      User     @relation(fields: [userId], references: [id])
  action    String   // e.g., "UPDATE_BOOKING", "DELETE_USER"
  entity    String   // e.g., "FlightBooking", "User"
  entityId  String   // ID of the mutated record
  details   Json?    // Optional JSON payload storing the diff or request body
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([entity, entityId])
  @@index([userId])
}
```

## 2. Updates to User Entity

We may need to ensure `User` has `AuditLog` relation.

```prisma
// Append to User model
auditLogs AuditLog[]
```

## 3. Pagination & Validation Types

No explicit DB changes, but standardizing queries:
- Every paginated query uses `skip` and `take`.
- Every list endpoint returns `{ data: T[], meta: { total, page, limit, totalPages } }`.
