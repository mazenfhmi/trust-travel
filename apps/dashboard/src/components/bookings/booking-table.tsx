import React from 'react';
import { DataTable } from '../shared/data-table';
import { StatusBadge } from '../shared/status-badge';
import { Button } from '../ui/button';
import { Eye, XCircle } from 'lucide-react';

export interface Booking {
  id: string;
  reference: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

interface BookingTableProps {
  bookings: Booking[];
  onView: (id: string) => void;
  onCancel: (id: string) => void;
}

export function BookingTable({ bookings, onView, onCancel }: BookingTableProps) {
  if (!bookings || bookings.length === 0) {
    return <div className="p-4 border rounded text-center text-gray-500">No bookings found</div>;
  }

  const columns = [
    { header: 'Reference', accessorKey: 'reference' as keyof Booking },
    { 
      header: 'Amount', 
      cell: (item: Booking) => `${item.totalAmount} ${item.currency}` 
    },
    { 
      header: 'Status', 
      cell: (item: Booking) => <StatusBadge status={item.status} /> 
    },
    { 
      header: 'Date', 
      cell: (item: Booking) => new Date(item.createdAt).toLocaleDateString() 
    },
    {
      header: 'Actions',
      cell: (item: Booking) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onView(item.id)}>
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {item.status !== 'CANCELLED' && (
            <Button variant="destructive" size="sm" onClick={() => onCancel(item.id)}>
              <XCircle className="w-4 h-4 mr-1" /> Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={bookings} />;
}
