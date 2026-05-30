import {
  UserRole,
  Locale,
  CabinClass,
  BookingStatus,
  PassengerType,
  VisaStatus,
  DocumentType,
  ValidationStatus,
  PaymentMethod,
  PaymentStatus,
  BookingType,
  RefundStatus,
  NotificationType,
} from './enums';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  nationality: string | null;
  passportNumber: string | null;
  role: UserRole;
  locale: Locale;
  isActive: boolean;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightBooking {
  id: string;
  reference: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  airline: string;
  cabinClass: CabinClass;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  eTicketRef: string | null;
  providerRef: string | null;
  paymentId: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Passenger {
  id: string;
  flightBookingId: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
  type: PassengerType;
  createdAt: Date;
}

export interface Hotel {
  id: string;
  name: string;
  nameAr: string | null;
  city: string;
  country: string;
  address: string;
  starRating: number;
  description: string | null;
  descriptionAr: string | null;
  amenities: string[];
  photos: string[];
  averageRating: number | null;
  reviewCount: number;
  isActive: boolean;
  providerRef: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  typeAr: string | null;
  capacity: number;
  pricePerNight: number;
  currency: string;
  totalInventory: number;
  description: string | null;
  photos: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelBooking {
  id: string;
  reference: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  nights: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  paymentId: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
}

export interface VisaApplication {
  id: string;
  reference: string;
  userId: string;
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
  status: VisaStatus;
  reviewerId: string | null;
  reviewerNotes: string | null;
  rejectionReason: string | null;
  maqamReference: string | null;
  maqamSubmittedAt: Date | null;
  maqamResponseAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  visaApplicationId: string;
  type: DocumentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  validationStatus: ValidationStatus;
  validationMessage: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayRef: string | null;
  gatewayResponse: any | null;
  bookingType: BookingType;
  bookingId: string;
  paidAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  gatewayRef: string | null;
  processedAt: Date | null;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: any | null;
  isRead: boolean;
  createdAt: Date;
}
