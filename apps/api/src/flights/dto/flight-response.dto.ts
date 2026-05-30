export class FlightPriceDto {
  amount: number;
  currency: string;
}

export class FlightSearchResultDto {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: string;
  price: FlightPriceDto;
  seatsAvailable: number;
}

export class FlightSearchMetaDto {
  totalResults: number;
  searchId: string;
}

export class FlightSearchResponseDto {
  results: FlightSearchResultDto[];
  meta: FlightSearchMetaDto;
}

export class PassengerDetailDto {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
  type: string;
}

export class FlightBookingResponseDto {
  bookingId: string;
  reference: string;
  status: string;
  totalAmount: number;
  currency: string;
  paymentUrl: string;
}

export class FlightBookingDetailDto {
  id: string;
  reference: string;
  status: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  airline: string;
  cabinClass: string;
  passengers: PassengerDetailDto[];
  totalAmount: number;
  currency: string;
  eTicketRef?: string;
  payment?: { status: string; method: string };
  createdAt: Date;
}

export class CancelBookingResponseDto {
  id: string;
  reference: string;
  status: string;
  cancellationReason: string;
  refund?: { id: string; amount: number; status: string };
}
