'use client';

import React from 'react';
import { useVisaDetail } from '@/hooks/use-visas';
import { DocumentViewer } from '@/components/visas/document-viewer';
import { ReviewActionPanel } from '@/components/visas/review-action-panel';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function VisaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: visa, isLoading, error, reviewVisa, isReviewing, submitToMaqam, isSubmitting } = useVisaDetail(id);

  if (isLoading) return <div className="p-8">Loading visa details...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load visa details</div>;
  if (!visa) return <div className="p-8">Visa not found</div>;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-5xl">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Application {visa.reference}</h2>
        <StatusBadge status={visa.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Full Name:</span> {visa.applicantName}</p>
            <p><span className="font-medium">Passport:</span> {visa.passportNumber}</p>
            <p><span className="font-medium">Nationality:</span> {visa.nationality}</p>
            <p><span className="font-medium">DOB:</span> {new Date(visa.dateOfBirth).toLocaleDateString()}</p>
            <p><span className="font-medium">Submitted:</span> {new Date(visa.submittedAt).toLocaleString()}</p>
          </CardContent>
        </Card>

        <ReviewActionPanel 
          onReview={async (status, notes, rejectionReason) => {
            await reviewVisa({ status, notes, rejectionReason });
          }}
          isReviewing={isReviewing}
          status={visa.status}
        />
      </div>

      {visa.status === 'APPROVED' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800">Ready for Maqam</h3>
              <p className="text-sm text-green-700">This application has been approved internally and is ready for submission.</p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => submitToMaqam()}
              disabled={isSubmitting}
            >
              Submit to Maqam
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Attached Documents</h3>
        <DocumentViewer documents={visa.documents} />
      </div>
    </div>
  );
}
