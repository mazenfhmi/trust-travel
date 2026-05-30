export class HotelPriceDto {
  amount: number;
  currency: string;
  perNight?: boolean;
}

export class HotelListItemDto {
  id: string;
  name: string;
  nameAr?: string;
  city: string;
  starRating: number;
  primaryPhoto?: string;
  averageRating?: number;
  reviewCount: number;
  startingPrice: HotelPriceDto;
  amenities: string[];
}

export class RoomDto {
  id: string;
  type: string;
  typeAr?: string;
  capacity: number;
  pricePerNight: HotelPriceDto;
  photos: string[];
  available: boolean;
}

export class HotelDetailDto extends HotelListItemDto {
  address: string;
  description?: string;
  descriptionAr?: string;
  photos: string[];
  rooms: RoomDto[];
}

export class RoomAvailabilityDto {
  roomId: string;
  available: boolean;
  totalNights: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
}

export class HotelBookingResponseDto {
  bookingId: string;
  reference: string;
  status: string;
  hotel: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  currency: string;
  paymentUrl: string;
}
