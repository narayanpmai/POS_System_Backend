import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearsController } from './fiscal-years.controller';

describe('FiscalYearsController', () => {
  let controller: FiscalYearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalYearsController],
    }).compile();

    controller = module.get<FiscalYearsController>(FiscalYearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
