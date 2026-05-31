import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ReportChartProps {
  data: any;
}

export function ReportChart({ data }: ReportChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Revenue by Service</CardTitle></CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </CardContent>
      </Card>
    );
  }

  // Placeholder for an actual chart implementation like Recharts
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Service</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-medium">{key}</span>
              <span>{value.revenue} SAR ({value.count} transactions)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
