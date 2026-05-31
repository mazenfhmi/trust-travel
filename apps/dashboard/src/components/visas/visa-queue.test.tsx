import React from 'react';
import { render, screen } from '@testing-library/react';
import { VisaQueue } from './visa-queue';

describe('VisaQueue', () => {
  const mockVisas = [
    {
      id: 'v1',
      reference: 'V-123',
      status: 'PENDING',
      applicantName: 'Ahmed Doe',
      nationality: 'SA',
      submittedAt: new Date().toISOString(),
    },
  ];

  it('renders a list of visas', () => {
    render(<VisaQueue visas={mockVisas} />);
    expect(screen.getByText('V-123')).toBeInTheDocument();
    expect(screen.getByText('Ahmed Doe')).toBeInTheDocument();
    expect(screen.getByText('SA')).toBeInTheDocument();
  });
});
