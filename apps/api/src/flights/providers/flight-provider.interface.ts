export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: string;
}

export interface FlightResult {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: string;
  price: { amount: number; currency: string };
  seatsAvailable: number;
}

export interface FlightSearchResponse {
  results: FlightResult[];
  meta: { totalResults: number; searchId: string };
}

export interface FlightProviderInterface {
  search(params: FlightSearchParams): Promise<FlightSearchResponse>;
  getFlightDetails(flightId: string): Promise<FlightResult | null>;
  holdSeat(flightId: string, passengers: number): Promise<{ held: boolean; expiresAt: string }>;
}

export const FLIGHT_PROVIDER = 'FLIGHT_PROVIDER';
