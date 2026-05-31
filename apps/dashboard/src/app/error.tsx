'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={() => reset()} variant="outline" className="mt-4">
        Try again
      </Button>
    </div>
  );
}
