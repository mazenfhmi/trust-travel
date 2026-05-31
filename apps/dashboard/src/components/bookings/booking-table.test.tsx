import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingTable } from './booking-table';

describe('BookingTable', () => {
  const mockBookings = [
    { id: '1', reference: 'TT-FL-123', status: 'CONFIRMED', totalAmount: 1500, currency: 'SAR', createdAt: '2026-05-30T10:00:00Z' },
    { id: '2', reference: 'TT-FL-456', status: 'PENDING', totalAmount: 800, currency: 'SAR', createdAt: '2026-05-30T11:00:00Z' },
  ];

  it('renders a list of bookings', () => {
    render(<BookingTable bookings={mockBookings} onCancel={jest.fn()} onView={jest.fn()} />);
    
    expect(screen.getByText('TT-FL-123')).toBeInTheDocument();
    expect(screen.getByText('TT-FL-456')).toBeInTheDocument();
    expect(screen.getByText('1500 SAR')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<BookingTable bookings={mockBookings} onCancel={jest.fn()} onView={onView} />);
    
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);
    
    expect(onView).toHaveBeenCalledWith('1');
  });

  it('shows empty state when no bookings', () => {
    render(<BookingTable bookings={[]} onCancel={jest.fn()} onView={jest.fn()} />);
    expect(screen.getByText('No bookings found')).toBeInTheDocument();
  });
});
