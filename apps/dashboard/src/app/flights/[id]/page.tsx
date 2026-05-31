'use client';

import React from 'react';
import { useBookingDetail } from '../../../hooks/use-bookings';
import { StatusBadge } from '../../../components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FlightBookingDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: booking, isLoading, error } = useBookingDetail('flights', id);

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
            <CardTitle>Flight Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Origin:</span> {booking.origin}</p>
            <p><span className="font-medium">Destination:</span> {booking.destination}</p>
            <p><span className="font-medium">Departure:</span> {new Date(booking.departureDate).toLocaleString()}</p>
            {booking.returnDate && <p><span className="font-medium">Return:</span> {new Date(booking.returnDate).toLocaleString()}</p>}
            <p><span className="font-medium">Airline:</span> {booking.airline}</p>
            <p><span className="font-medium">Cabin Class:</span> {booking.cabinClass}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Total Amount:</span> {booking.totalAmount} {booking.currency}</p>
            <p><span className="font-medium">Date Booked:</span> {new Date(booking.createdAt).toLocaleString()}</p>
            {booking.eTicketRef && <p><span className="font-medium">eTicket:</span> {booking.eTicketRef}</p>}
            {booking.providerRef && <p><span className="font-medium">PNR:</span> {booking.providerRef}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Passengers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {booking.passengers?.map((p: any, i: number) => (
              <div key={i} className="flex justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">{p.firstName} {p.lastName}</p>
                  <p className="text-sm text-gray-500">{p.type} • {p.nationality}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Passport: {p.passportNumber}</p>
                  <p className="text-sm text-gray-500">DOB: {new Date(p.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
