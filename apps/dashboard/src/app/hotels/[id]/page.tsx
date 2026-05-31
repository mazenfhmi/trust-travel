'use client';

import React from 'react';
import { useBookingDetail } from '../../../hooks/use-bookings';
import { StatusBadge } from '../../../components/shared/status-badge';
import { PaymentReview } from '../../../components/bookings/payment-review';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function HotelBookingDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: booking, isLoading, error } = useBookingDetail('hotels', id);

  if (isLoading) return <div className="p-8">Loading details...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading booking details</div>;
  if (!booking) return <div className="p-8">Booking not found</div>;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Booking {booking.reference}</h2>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stay Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Hotel:</span> {booking.hotel?.name}</p>
            <p><span className="font-medium">Room Type:</span> {booking.room?.type}</p>
            <p><span className="font-medium">Check-In:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><span className="font-medium">Check-Out:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><span className="font-medium">Nights:</span> {booking.nights}</p>
            <p><span className="font-medium">Guests:</span> {booking.guestCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Total Amount:</span> {booking.totalAmount} {booking.currency}</p>
            <p><span className="font-medium">Date Booked:</span> {new Date(booking.createdAt).toLocaleString()}</p>
            {booking.cancellationReason && (
              <p className="text-red-500"><span className="font-medium">Cancellation:</span> {booking.cancellationReason}</p>
            )}
            {booking.payment && (
              <div className="mt-4 border-t pt-4">
                <p><span className="font-medium">Payment Status:</span> <StatusBadge status={booking.payment.status} /></p>
                <p><span className="font-medium">Method:</span> {booking.payment.method}</p>
                <PaymentReview paymentId={booking.payment.id} status={booking.payment.status} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
