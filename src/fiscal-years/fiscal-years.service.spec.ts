import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearsService } from './fiscal-years.service';

describe('FiscalYearsService', () => {
  let service: FiscalYearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiscalYearsService],
    }).compile();

    service = module.get<FiscalYearsService>(FiscalYearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
