import React from 'react';
import { SummaryCard } from '../components/dashboard/summary-card';
import { Plane, Hotel, FileText, DollarSign } from 'lucide-react';
import { cookies } from 'next/headers';

async function getDashboardSummary() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return res.json();
}

export default async function DashboardHome() {
  const data = await getDashboardSummary();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Flights"
          value={data.flights.total}
          icon={<Plane className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Total Hotels"
          value={data.hotels.total}
          icon={<Hotel className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Pending Visas"
          value={data.visas.pending + data.visas.underReview}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Total Revenue"
          value={`${data.revenue.total} ${data.revenue.currency}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
