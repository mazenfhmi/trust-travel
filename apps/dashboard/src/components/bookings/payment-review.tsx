'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { fetchApi } from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

export function PaymentReview({ paymentId, status }: { paymentId: string; status: string }) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== 'PENDING') {
    return null;
  }

  const handleUpdate = async (newStatus: 'COMPLETED' | 'FAILED') => {
    setIsUpdating(true);
    setError(null);
    try {
      await fetchApi(`/admin/payments/${paymentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-900 mb-2">Admin Payment Review</h4>
      <p className="text-sm text-blue-800 mb-4">
        This booking is pending bank transfer confirmation. Review the bank transfer receipt and confirm or reject the payment.
      </p>
      
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      
      <div className="flex space-x-3">
        <Button 
          onClick={() => handleUpdate('COMPLETED')} 
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Confirm Payment
        </Button>
        <Button 
          onClick={() => handleUpdate('FAILED')} 
          disabled={isUpdating}
          variant="destructive"
        >
          <X className="mr-2 h-4 w-4" />
          Reject Payment
        </Button>
      </div>
    </div>
  );
}
