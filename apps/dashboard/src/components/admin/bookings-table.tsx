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

type Booking = {
  id: string;
  reference: string;
  user: { firstName: string; lastName: string; email: string };
  status: string;
  totalAmount: number;
  createdAt: string;
};

interface BookingsTableProps {
  bookings: Booking[];
  page: number;
  totalPages: number;
}

export function BookingsTable({ bookings, page, totalPages }: BookingsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount (SAR)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.reference}</TableCell>
                <TableCell>
                  {booking.user.firstName} {booking.user.lastName}
                  <div className="text-xs text-gray-500">{booking.user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'outline'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>{booking.totalAmount}</TableCell>
                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No bookings found.
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
