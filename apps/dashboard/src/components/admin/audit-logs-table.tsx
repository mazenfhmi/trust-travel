import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type AuditLog = {
  id: string;
  user: { email: string; role: string };
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  createdAt: string;
};

interface AuditLogsTableProps {
  logs: AuditLog[];
  page: number;
  totalPages: number;
}

export function AuditLogsTable({ logs, page, totalPages }: AuditLogsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead className="text-right">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {log.user.email}
                  <div className="text-xs text-gray-500">{log.user.role}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action}</Badge>
                </TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>{log.entityId}</TableCell>
                <TableCell className="text-right">{log.ipAddress || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          {page <= 1 ? (
            <Button variant="outline" size="sm" disabled>Previous</Button>
          ) : (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={`?page=${page - 1}`}>Previous</Link>
          )}
          {page >= totalPages ? (
            <Button variant="outline" size="sm" disabled>Next</Button>
          ) : (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={`?page=${page + 1}`}>Next</Link>
          )}
        </div>
      </div>
    </div>
  );
}
