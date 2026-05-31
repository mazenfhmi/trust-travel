'use client';

import React, { useState } from 'react';
import { useVisas } from '@/hooks/use-visas';
import { VisaQueue } from '@/components/visas/visa-queue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VisasPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useVisas(page, 20);

  if (isLoading) return <div className="p-8">Loading visas...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load visa queue</div>;

  const visas = data?.data || data || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Visa Applications Queue</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending & In Progress Visas</CardTitle>
        </CardHeader>
        <CardContent>
          <VisaQueue visas={visas} />
        </CardContent>
      </Card>
    </div>
  );
}
