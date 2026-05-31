# Admin API Contracts

## 1. Universal Pagination Interface

All Admin GET endpoints for lists (e.g., `/api/v1/admin/users`, `/api/v1/admin/audit-logs`) MUST accept standard pagination queries and return standard responses.

### Request Query

```typescript
export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string; // e.g., "createdAt:desc"
}
```

### Response Shape

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

## 2. Audit Logs API

**Endpoint**: `GET /api/v1/admin/audit-logs`
**Role**: `SUPER_ADMIN`
**Description**: Fetches paginated audit logs for system accountability.
