export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  minStars?: number;
  maxPrice?: number;
}

export interface HotelListItem {
  id: string;
  name: string;
  nameAr?: string;
  city: string;
  starRating: number;
  primaryPhoto?: string;
  averageRating?: number;
  reviewCount: number;
  startingPrice: { amount: number; currency: string; perNight: boolean };
  amenities: string[];
}

export interface RoomDetail {
  id: string;
  type: string;
  typeAr?: string;
  capacity: number;
  pricePerNight: { amount: number; currency: string };
  photos: string[];
  available: boolean;
}

export interface HotelDetail extends HotelListItem {
  address: string;
  description?: string;
  descriptionAr?: string;
  photos: string[];
  rooms: RoomDetail[];
}

export interface HotelProviderInterface {
  search(params: HotelSearchParams): Promise<{ data: HotelListItem[]; total: number }>;
  getHotelDetails(hotelId: string): Promise<HotelDetail | null>;
  checkAvailability(
    hotelId: string,
    roomId: string,
    checkIn: string,
    checkOut: string,
  ): Promise<{ available: boolean; totalNights: number; pricePerNight: number; totalPrice: number; currency: string }>;
}

export const HOTEL_PROVIDER = 'HOTEL_PROVIDER';
