'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface ReviewActionPanelProps {
  onReview: (status: string, notes: string, rejectionReason?: string) => Promise<void>;
  isReviewing: boolean;
  status: string;
}

export function ReviewActionPanel({ onReview, isReviewing, status }: ReviewActionPanelProps) {
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (status !== 'PENDING' && status !== 'UNDER_REVIEW') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">This application is already {status}. No further actions can be taken.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAction = async (actionStatus: 'APPROVED' | 'REJECTED') => {
    if (actionStatus === 'REJECTED' && !rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    setError(null);
    try {
      await onReview(actionStatus, notes, rejectionReason);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-red-500">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Internal Notes</label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add internal notes about this application..."
            disabled={isReviewing}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-red-600">Rejection Reason (if rejecting)</label>
          <Input 
            value={rejectionReason} 
            onChange={(e) => setRejectionReason(e.target.value)} 
            placeholder="Required for rejection..."
            disabled={isReviewing}
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
            onClick={() => handleAction('APPROVED')}
            disabled={isReviewing}
          >
            Approve Application
          </Button>
          <Button 
            className="flex-1" 
            variant="destructive"
            onClick={() => handleAction('REJECTED')}
            disabled={isReviewing}
          >
            Reject Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
