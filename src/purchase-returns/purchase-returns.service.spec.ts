import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseReturnsService } from './purchase-returns.service';

describe('PurchaseReturnsService', () => {
  let service: PurchaseReturnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseReturnsService],
    }).compile();

    service = module.get<PurchaseReturnsService>(PurchaseReturnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
