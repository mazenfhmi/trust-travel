import { Injectable } from '@nestjs/common';
import {
  HotelProviderInterface,
  HotelSearchParams,
  HotelListItem,
  HotelDetail,
} from './hotel-provider.interface';

const MOCK_HOTELS: HotelDetail[] = [
  {
    id: 'hotel-makkah-001',
    name: 'Abraj Al-Bait Towers Hotel',
    nameAr: 'فندق أبراج البيت',
    city: 'Makkah',
    address: 'King Abdul Aziz Endowment, Makkah 24231',
    starRating: 5,
    primaryPhoto: 'https://images.unsplash.com/photo-1591431460424-af4a5a2c1a56?w=800',
    description: 'Iconic hotel overlooking the Masjid Al-Haram, offering luxury rooms with views of the Kaaba.',
    descriptionAr: 'فندق أيقوني يطل على المسجد الحرام مع غرف فاخرة.',
    amenities: ['wifi', 'restaurant', 'spa', 'gym', 'concierge', 'prayer_room'],
    photos: [
      'https://images.unsplash.com/photo-1591431460424-af4a5a2c1a56?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
    ],
    averageRating: 4.8,
    reviewCount: 1247,
    startingPrice: { amount: 1500, currency: 'SAR', perNight: true },
    rooms: [
      {
        id: 'room-makkah-001-std',
        type: 'Standard Double',
        typeAr: 'مزدوج قياسي',
        capacity: 2,
        pricePerNight: { amount: 1500, currency: 'SAR' },
        photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        available: true,
      },
      {
        id: 'room-makkah-001-suite',
        type: 'Kaaba View Suite',
        typeAr: 'جناح إطلالة الكعبة',
        capacity: 4,
        pricePerNight: { amount: 4500, currency: 'SAR' },
        photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
        available: true,
      },
    ],
  },
  {
    id: 'hotel-madinah-001',
    name: 'Pullman Zamzam Madinah',
    nameAr: 'بولمان زمزم المدينة',
    city: 'Madinah',
    address: 'King Fahd Rd, Al Haram, Medina 42311',
    starRating: 5,
    primaryPhoto: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    description: 'Luxury hotel steps from Al-Masjid an-Nabawi with premium amenities.',
    descriptionAr: 'فندق فاخر على بعد خطوات من المسجد النبوي.',
    amenities: ['wifi', 'restaurant', 'gym', 'concierge', 'prayer_room', 'laundry'],
    photos: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200'],
    averageRating: 4.6,
    reviewCount: 892,
    startingPrice: { amount: 900, currency: 'SAR', perNight: true },
    rooms: [
      {
        id: 'room-madinah-001-std',
        type: 'Deluxe Room',
        typeAr: 'غرفة ديلوكس',
        capacity: 2,
        pricePerNight: { amount: 900, currency: 'SAR' },
        photos: [],
        available: true,
      },
    ],
  },
  {
    id: 'hotel-riyadh-001',
    name: 'Four Seasons Hotel Riyadh',
    nameAr: 'فندق فور سيزونز الرياض',
    city: 'Riyadh',
    address: 'Kingdom Centre, Olaya, Riyadh 12214',
    starRating: 5,
    primaryPhoto: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    description: 'Ultra-luxury hotel in the iconic Kingdom Centre tower.',
    descriptionAr: 'فندق فائق الفخامة في برج المملكة الأيقوني.',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'valet', 'concierge'],
    photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200'],
    averageRating: 4.9,
    reviewCount: 567,
    startingPrice: { amount: 1200, currency: 'SAR', perNight: true },
    rooms: [
      {
        id: 'room-riyadh-001-deluxe',
        type: 'Deluxe King',
        typeAr: 'كينج ديلوكس',
        capacity: 2,
        pricePerNight: { amount: 1200, currency: 'SAR' },
        photos: [],
        available: true,
      },
      {
        id: 'room-riyadh-001-suite',
        type: 'Kingdom Suite',
        typeAr: 'جناح المملكة',
        capacity: 4,
        pricePerNight: { amount: 5500, currency: 'SAR' },
        photos: [],
        available: false,
      },
    ],
  },
];

@Injectable()
export class MockHotelProvider implements HotelProviderInterface {
  async search(params: HotelSearchParams): Promise<{ data: HotelListItem[]; total: number }> {
    let results = MOCK_HOTELS.filter(
      (h) => h.city.toLowerCase() === params.city.toLowerCase(),
    );

    if (params.minStars) {
      results = results.filter((h) => h.starRating >= params.minStars!);
    }

    if (params.maxPrice) {
      results = results.filter((h) => h.startingPrice.amount <= params.maxPrice!);
    }

    return { data: results as HotelListItem[], total: results.length };
  }

  async getHotelDetails(hotelId: string): Promise<HotelDetail | null> {
    return MOCK_HOTELS.find((h) => h.id === hotelId) ?? null;
  }

  async checkAvailability(
    hotelId: string,
    roomId: string,
    checkIn: string,
    checkOut: string,
  ) {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    const room = hotel?.rooms.find((r) => r.id === roomId);

    if (!room) {
      return { available: false, totalNights: 0, pricePerNight: 0, totalPrice: 0, currency: 'SAR' };
    }

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      available: room.available,
      totalNights: nights,
      pricePerNight: room.pricePerNight.amount,
      totalPrice: room.pricePerNight.amount * nights,
      currency: room.pricePerNight.currency,
    };
  }
}
