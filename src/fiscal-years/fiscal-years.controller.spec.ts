import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearsController } from './fiscal-years.controller';
import { FiscalYearsService } from './fiscal-years.service';

const mockFiscalYearsService = {
  findAll: jest.fn(),
  findActive: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  setActive: jest.fn(),
  delete: jest.fn(),
};

describe('FiscalYearsController', () => {
  let controller: FiscalYearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalYearsController],
      providers: [
        {
          provide: FiscalYearsService,
          useValue: mockFiscalYearsService,
        },
      ],
    }).compile();

    controller = module.get<FiscalYearsController>(FiscalYearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
