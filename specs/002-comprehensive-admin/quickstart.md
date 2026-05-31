# Quickstart: Comprehensive Administration

## 1. Apply Database Changes

Run the Prisma migration to add the `AuditLog` table.

```bash
cd apps/api
npx prisma migrate dev --name add_audit_logs
npx prisma generate
```

## 2. Environment Variables

No new environment variables are strictly required for this feature.

## 3. Start the application

```bash
pnpm dev
```

## 4. Verification

1. Log in to the dashboard as a user with the `SUPER_ADMIN` role.
2. Navigate to the `/admin/users` or `/admin/bookings` route.
3. Perform an action (e.g., editing a user).
4. Verify the change in the UI, and check the database `AuditLog` table to ensure a new record was created reflecting the change.
