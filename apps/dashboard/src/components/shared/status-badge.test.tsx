import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('renders PENDING status with correct text', () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders CONFIRMED status with correct text', () => {
    render(<StatusBadge status="CONFIRMED" />);
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });

  it('renders CANCELLED status with correct text', () => {
    render(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText('CANCELLED')).toBeInTheDocument();
  });

  it('handles unknown status gracefully', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />);
    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument();
  });
});
