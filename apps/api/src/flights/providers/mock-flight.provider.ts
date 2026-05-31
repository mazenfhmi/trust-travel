import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  FlightProviderInterface,
  FlightSearchParams,
  FlightSearchResponse,
  FlightResult,
} from './flight-provider.interface';

const MOCK_FLIGHTS: FlightResult[] = [
  {
    id: 'mock-fl-001',
    airline: 'Saudia',
    origin: 'RUH',
    destination: 'IST',
    departureTime: '2026-06-15T08:00:00Z',
    arrivalTime: '2026-06-15T13:30:00Z',
    duration: 'PT5H30M',
    stops: 0,
    cabinClass: 'ECONOMY',
    price: { amount: 1250.0, currency: 'SAR' },
    seatsAvailable: 42,
  },
  {
    id: 'mock-fl-002',
    airline: 'flynas',
    origin: 'RUH',
    destination: 'IST',
    departureTime: '2026-06-15T14:00:00Z',
    arrivalTime: '2026-06-15T20:00:00Z',
    duration: 'PT6H00M',
    stops: 1,
    cabinClass: 'ECONOMY',
    price: { amount: 980.0, currency: 'SAR' },
    seatsAvailable: 15,
  },
  {
    id: 'mock-fl-003',
    airline: 'flyadeal',
    origin: 'JED',
    destination: 'CAI',
    departureTime: '2026-06-16T06:30:00Z',
    arrivalTime: '2026-06-16T08:30:00Z',
    duration: 'PT2H00M',
    stops: 0,
    cabinClass: 'ECONOMY',
    price: { amount: 650.0, currency: 'SAR' },
    seatsAvailable: 30,
  },
  {
    id: 'mock-fl-004',
    airline: 'Saudia',
    origin: 'RUH',
    destination: 'DXB',
    departureTime: '2026-06-17T10:00:00Z',
    arrivalTime: '2026-06-17T12:00:00Z',
    duration: 'PT2H00M',
    stops: 0,
    cabinClass: 'BUSINESS',
    price: { amount: 2200.0, currency: 'SAR' },
    seatsAvailable: 8,
  },
  {
    id: 'mock-fl-005',
    airline: 'Emirates',
    origin: 'RUH',
    destination: 'DXB',
    departureTime: '2026-06-17T16:00:00Z',
    arrivalTime: '2026-06-17T18:00:00Z',
    duration: 'PT2H00M',
    stops: 0,
    cabinClass: 'ECONOMY',
    price: { amount: 890.0, currency: 'SAR' },
    seatsAvailable: 25,
  },
];

@Injectable()
export class MockFlightProvider implements FlightProviderInterface {
  async search(params: FlightSearchParams): Promise<FlightSearchResponse> {
    const results = MOCK_FLIGHTS.filter(
      (f) =>
        f.origin === params.origin.toUpperCase() &&
        f.destination === params.destination.toUpperCase() &&
        (!params.cabinClass ||
          f.cabinClass === params.cabinClass.toUpperCase()),
    );

    return {
      results,
      meta: {
        totalResults: results.length,
        searchId: randomUUID(),
      },
    };
  }

  async getFlightDetails(flightId: string): Promise<FlightResult | null> {
    return MOCK_FLIGHTS.find((f) => f.id === flightId) ?? null;
  }

  async holdSeat(
    flightId: string,
    _passengers: number,
  ): Promise<{ held: boolean; expiresAt: string }> {
    const flight = MOCK_FLIGHTS.find((f) => f.id === flightId);
    const held = !!flight && flight.seatsAvailable > 0;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    return { held, expiresAt };
  }
}
