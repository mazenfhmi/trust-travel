import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportChart } from './report-chart';

describe('ReportChart', () => {
  it('renders chart placeholder when data is present', () => {
    const data = {
      FLIGHT: { revenue: 1000, count: 5 },
      HOTEL: { revenue: 500, count: 2 },
    };

    render(<ReportChart data={data} />);
    
    // As we are likely using a charting library that might be hard to test fully,
    // we test for text elements or simple structural renders.
    expect(screen.getByText('Revenue by Service')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<ReportChart data={{}} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
