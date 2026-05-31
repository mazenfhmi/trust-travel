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

type RoleData = {
  role: string;
  department: string;
  userCount: number;
};

interface RolesTableProps {
  roles: RoleData[];
  page: number;
  totalPages: number;
}

export function RolesTable({ roles, page, totalPages }: RolesTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Active Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((roleData) => (
              <TableRow key={roleData.role}>
                <TableCell className="font-medium">{roleData.role}</TableCell>
                <TableCell>{roleData.department}</TableCell>
                <TableCell>{roleData.userCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage Permissions</Button>
                </TableCell>
              </TableRow>
            ))}
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No roles found.
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
