'use client';

import React, { useState } from 'react';
import { useBookings } from '../../hooks/use-bookings';
import { BookingTable } from '../../components/bookings/booking-table';
import { SearchInput } from '../../components/shared/search-input';
import { useRouter } from 'next/navigation';
import { CancelDialog } from '../../components/bookings/cancel-dialog';

export default function HotelsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);
  
  const { data, isLoading, error, cancelBooking } = useBookings('hotels', page, 20);
  const router = useRouter();

  if (error) throw error;

  let filteredBookings = data?.data || [];
  if (search) {
    filteredBookings = filteredBookings.filter((b: any) => 
      b.reference.toLowerCase().includes(search.toLowerCase())
    );
  }

  const handleCancel = async (reason: string) => {
    if (!cancelId) return;
    await cancelBooking({ id: cancelId, reason });
    setCancelId(null);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hotel Bookings</h2>
      </div>
      
      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search references..." onSearch={setSearch} />
      </div>

      {isLoading ? (
        <div className="py-10 text-center">Loading bookings...</div>
      ) : (
        <BookingTable 
          bookings={filteredBookings} 
          onView={(id) => router.push(`/hotels/${id}`)}
          onCancel={(id) => setCancelId(id)}
        />
      )}

      {cancelId && (
        <CancelDialog 
          isOpen={true} 
          onClose={() => setCancelId(null)} 
          onConfirm={handleCancel} 
        />
      )}
    </div>
  );
}
