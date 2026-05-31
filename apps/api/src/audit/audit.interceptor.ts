import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = req;

    // We only log mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          // Fire and forget audit log creation
          this.logAction(method, url, user, body, ip).catch((err) => {
            console.error('Failed to write audit log:', err);
          });
        }),
      );
    }

    return next.handle();
  }

  private async logAction(
    method: string,
    url: string,
    user: any,
    body: any,
    ip: string,
  ) {
    if (!user || !user.id) {
      return; // Cannot log action without user
    }

    // Extract entity and ID from URL if possible
    // Very basic parsing: /api/users/123 -> entity: users, id: 123
    const parts = url.split('/').filter(Boolean);
    const entityIndex = parts.indexOf('admin') + 1;
    let entity = 'unknown';
    let entityId = 'unknown';

    if (entityIndex > 0 && entityIndex < parts.length) {
      entity = parts[entityIndex];
      if (parts[entityIndex + 1]) {
        entityId = parts[entityIndex + 1];
      }
    }

    let action = method;
    if (method === 'POST') action = 'CREATE';
    if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
    if (method === 'DELETE') action = 'DELETE';

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        entity,
        entityId,
        details: body,
        ipAddress: ip,
      },
    });
  }
}
