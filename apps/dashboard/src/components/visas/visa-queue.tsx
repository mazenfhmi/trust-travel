'use client';

import React from 'react';
import { StatusBadge } from '../shared/status-badge';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function VisaQueue({ visas }: { visas: any[] }) {
  const router = useRouter();

  if (!visas || visas.length === 0) {
    return <div className="p-8 text-center text-gray-500">No applications in the queue</div>;
  }

  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visas.map((visa) => (
            <tr key={visa.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visa.reference}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visa.applicantName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visa.nationality}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(visa.submittedAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={visa.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm" onClick={() => router.push(`/visas/${visa.id}`)}>
                  Review
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
