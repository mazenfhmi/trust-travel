import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let color = 'bg-gray-100 text-gray-800';

  if (['CONFIRMED', 'COMPLETED', 'APPROVED'].includes(status)) {
    color = 'bg-green-100 text-green-800 border-green-200';
  } else if (['PENDING', 'UNDER_REVIEW'].includes(status)) {
    color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (['CANCELLED', 'FAILED', 'REJECTED'].includes(status)) {
    color = 'bg-red-100 text-red-800 border-red-200';
  }

  return <Badge variant="outline" className={`${color} font-medium`}>{status}</Badge>;
}
