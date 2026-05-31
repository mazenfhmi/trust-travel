import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    payment: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFinancialReport', () => {
    it('should calculate totals and return transactions', async () => {
      mockPrismaService.payment.aggregate.mockResolvedValueOnce({
        _sum: { amount: 1000 },
      });
      mockPrismaService.payment.count.mockResolvedValueOnce(5);
      mockPrismaService.payment.findMany.mockResolvedValueOnce([
        { id: '1', amount: 200, status: 'COMPLETED' },
      ]);

      const result = await service.generateFinancialReport({ page: 1, limit: 10 });
      
      expect(result.summary.totalRevenue).toBe(1000);
      expect(result.transactions.meta.total).toBe(5);
      expect(result.transactions.data.length).toBe(1);
    });
  });
});
