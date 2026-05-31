import { BookingsTable } from '@/components/admin/bookings-table';

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  
  const mockBookings = [
    {
      id: '1',
      reference: 'BK-12345',
      user: { firstName: 'Ali', lastName: 'Ahmad', email: 'ali@example.com' },
      status: 'CONFIRMED',
      totalAmount: 1500.00,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>
      <BookingsTable 
        bookings={mockBookings} 
        page={page} 
        totalPages={1} 
      />
    </div>
  );
}
