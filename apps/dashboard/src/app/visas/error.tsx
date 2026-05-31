'use client';

import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';

export default function VisasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-500">Failed to load the visa queue.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
