import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseReturnsController } from './purchase-returns.controller';

describe('PurchaseReturnsController', () => {
  let controller: PurchaseReturnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseReturnsController],
    }).compile();

    controller = module.get<PurchaseReturnsController>(PurchaseReturnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
