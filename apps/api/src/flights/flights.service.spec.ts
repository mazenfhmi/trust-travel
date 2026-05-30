import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { PrismaService } from '../prisma/prisma.service';
import { FLIGHT_PROVIDER } from './providers/flight-provider.interface';
import { PaymentsService } from '../payments/payments.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PassengerType } from '@prisma/client';

type MockFlightProvider = {
  search: jest.Mock;
  getFlightDetails: jest.Mock;
  holdSeat: jest.Mock;
};

type MockPrismaFlightBooking = {
  create: jest.Mock;
  findUnique: jest.Mock;
  findMany: jest.Mock;
  count: jest.Mock;
  update: jest.Mock;
};

const mockFlightResult = {
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
};

describe('FlightsService', () => {
  let service: FlightsService;
  let mockProvider: MockFlightProvider;
  let flightBooking: MockPrismaFlightBooking;
  let paymentsService: jest.Mocked<PaymentsService>;

  beforeEach(async () => {
    mockProvider = {
      search: jest.fn(),
      getFlightDetails: jest.fn(),
      holdSeat: jest.fn(),
    };

    flightBooking = {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: PrismaService,
          useValue: { flightBooking },
        },
        {
          provide: FLIGHT_PROVIDER,
          useValue: mockProvider,
        },
        {
          provide: PaymentsService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue({
              payment: { id: 'payment-id' },
              paymentUrl: 'https://moyasar.com/pay/test',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
    paymentsService = module.get(PaymentsService);
  });

  describe('search', () => {
    it('should return search results from provider', async () => {
      const searchResult = { results: [mockFlightResult], meta: { totalResults: 1, searchId: 'uuid' } };
      mockProvider.search.mockResolvedValue(searchResult);

      const result = await service.search({
        origin: 'RUH',
        destination: 'IST',
        departureDate: '2026-06-15',
        passengers: 1,
        cabinClass: undefined,
      } as any);

      expect(result).toEqual(searchResult);
      expect(mockProvider.search).toHaveBeenCalledWith(
        expect.objectContaining({ origin: 'RUH', destination: 'IST' }),
      );
    });
  });

  describe('compare', () => {
    it('should return details for multiple flights', async () => {
      mockProvider.getFlightDetails.mockResolvedValue(mockFlightResult);

      const result = await service.compare({ flightIds: ['mock-fl-001', 'mock-fl-002'] });

      expect(result.flights).toHaveLength(2);
    });

    it('should throw NotFoundException if a flight is not found', async () => {
      mockProvider.getFlightDetails.mockResolvedValueOnce(mockFlightResult);
      mockProvider.getFlightDetails.mockResolvedValueOnce(null);

      await expect(
        service.compare({ flightIds: ['mock-fl-001', 'missing-id'] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('bookFlight', () => {
    const bookDto = {
      flightId: 'mock-fl-001',
      passengers: [
        {
          firstName: 'Ahmed',
          lastName: 'Al-Rashidi',
          passportNumber: 'A1234567',
          nationality: 'SA',
          dateOfBirth: '1990-01-15',
          type: PassengerType.ADULT,
        },
      ],
      contactEmail: 'ahmed@example.com',
    };

    it('should create a booking and return payment URL', async () => {
      mockProvider.getFlightDetails.mockResolvedValue(mockFlightResult);
      mockProvider.holdSeat.mockResolvedValue({ held: true, expiresAt: '2026-06-15T08:15:00Z' });
      flightBooking.create.mockResolvedValue({
        id: 'booking-id',
        reference: 'TT-FL-ABCDEF',
        status: 'PENDING',
        totalAmount: 1250,
        currency: 'SAR',
      });

      const result = await service.bookFlight('user-id', bookDto);

      expect(result).toHaveProperty('bookingId', 'booking-id');
      expect(result).toHaveProperty('reference', 'TT-FL-ABCDEF');
      expect(result).toHaveProperty('paymentUrl');
      expect(paymentsService.createPayment).toHaveBeenCalled();
    });

    it('should throw NotFoundException if flight not found', async () => {
      mockProvider.getFlightDetails.mockResolvedValue(null);

      await expect(service.bookFlight('user-id', bookDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no seats available', async () => {
      mockProvider.getFlightDetails.mockResolvedValue(mockFlightResult);
      mockProvider.holdSeat.mockResolvedValue({ held: false, expiresAt: '' });

      await expect(service.bookFlight('user-id', bookDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBooking', () => {
    it('should return booking for the owner', async () => {
      flightBooking.findUnique.mockResolvedValue({
        id: 'booking-id',
        userId: 'user-id',
        reference: 'TT-FL-ABCDEF',
        status: 'CONFIRMED',
        passengers: [],
        payment: null,
        origin: 'RUH',
        destination: 'IST',
        departureDate: new Date(),
        airline: 'Saudia',
        cabinClass: 'ECONOMY',
        totalAmount: 1250,
        currency: 'SAR',
        eTicketRef: 'ET-XYZ123',
        createdAt: new Date(),
      });

      const result = await service.getBooking('booking-id', 'user-id', 'TRAVELER');

      expect(result).toHaveProperty('reference', 'TT-FL-ABCDEF');
    });

    it('should throw NotFoundException if booking not found', async () => {
      flightBooking.findUnique.mockResolvedValue(null);

      await expect(service.getBooking('missing-id', 'user-id', 'TRAVELER')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      flightBooking.findUnique.mockResolvedValue({
        id: 'booking-id',
        userId: 'other-user-id',
        passengers: [],
        payment: null,
      });

      await expect(service.getBooking('booking-id', 'user-id', 'TRAVELER')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('listBookings', () => {
    it('should list only own bookings for TRAVELER', async () => {
      flightBooking.findMany.mockResolvedValue([]);
      flightBooking.count.mockResolvedValue(0);

      const result = await service.listBookings('user-id', 'TRAVELER', { page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(flightBooking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-id' } }),
      );
    });

    it('should list all bookings for BOOKING_AGENT', async () => {
      flightBooking.findMany.mockResolvedValue([]);
      flightBooking.count.mockResolvedValue(0);

      await service.listBookings('agent-id', 'BOOKING_AGENT', { page: 1, limit: 20 });

      expect(flightBooking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking for the owner', async () => {
      flightBooking.findUnique.mockResolvedValue({
        id: 'booking-id',
        userId: 'user-id',
        status: 'CONFIRMED',
        payment: null,
      });
      flightBooking.update.mockResolvedValue({
        id: 'booking-id',
        reference: 'TT-FL-ABCDEF',
        status: 'CANCELLED',
        cancellationReason: 'Changed plans',
      });

      const result = await service.cancelBooking('booking-id', 'user-id', 'TRAVELER', 'Changed plans');

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw BadRequestException if already cancelled', async () => {
      flightBooking.findUnique.mockResolvedValue({
        id: 'booking-id',
        userId: 'user-id',
        status: 'CANCELLED',
        payment: null,
      });

      await expect(
        service.cancelBooking('booking-id', 'user-id', 'TRAVELER', 'reason'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
