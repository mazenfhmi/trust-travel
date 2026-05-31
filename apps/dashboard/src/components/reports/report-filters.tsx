import React from 'react';
import { Input } from '../ui/input';

interface ReportFiltersProps {
  filters: {
    from: string;
    to: string;
    serviceType: string;
    paymentStatus: string;
  };
  onChange: (key: string, value: string) => void;
}

export function ReportFilters({ filters, onChange }: ReportFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">From</label>
        <Input type="date" value={filters.from} onChange={(e) => onChange('from', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">To</label>
        <Input type="date" value={filters.to} onChange={(e) => onChange('to', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Service</label>
        <select 
          className="w-full border rounded-md p-2 h-10"
          value={filters.serviceType} 
          onChange={(e) => onChange('serviceType', e.target.value)}
        >
          <option value="ALL">All Services</option>
          <option value="FLIGHT">Flights</option>
          <option value="HOTEL">Hotels</option>
          <option value="VISA">Visas</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Status</label>
        <select 
          className="w-full border rounded-md p-2 h-10"
          value={filters.paymentStatus} 
          onChange={(e) => onChange('paymentStatus', e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>
    </div>
  );
}
