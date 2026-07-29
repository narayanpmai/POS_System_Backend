import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearsService } from './fiscal-years.service';
import { PrismaService } from '../prisma/prisma.service';

// Minimal mock that satisfies the PrismaService interface needed by FiscalYearsService
const mockPrismaService = {
  fiscalYear: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
};

describe('FiscalYearsService', () => {
  let service: FiscalYearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FiscalYearsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FiscalYearsService>(FiscalYearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
