import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { ReportQuery, exportReport } from '../../hooks/use-reports';

interface ExportButtonProps {
  query: ReportQuery;
}

export function ExportButton({ query }: ExportButtonProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => exportReport(query, 'CSV')}>
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      <Button variant="outline" onClick={() => exportReport(query, 'PDF')}>
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
}
