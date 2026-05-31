import React from 'react';
import { render, screen } from '@testing-library/react';
import { SummaryCard } from './summary-card';
import { Plane } from 'lucide-react';

describe('SummaryCard', () => {
  it('renders title and value', () => {
    render(<SummaryCard title="Flights" value={150} icon={<Plane data-testid="plane-icon" />} trend={{ value: 5, isPositive: true }} />);
    
    expect(screen.getByText('Flights')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByTestId('plane-icon')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    render(<SummaryCard title="Hotels" value={100} icon={<Plane />} trend={{ value: 2, isPositive: false }} />);
    expect(screen.getByText('-2%')).toBeInTheDocument();
  });
});
