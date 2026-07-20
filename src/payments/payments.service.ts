import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SalesService } from '../sales/sales.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private salesService: SalesService
  ) {}

  async processPayment(data: { amount: number, provider: string, sourceToken: string, saleDto?: any, cashierId?: number }) {
    // 1. Simulate hitting an external payment gateway (Stripe/eSewa)
    // In production, we'd use stripe.charges.create(...)
    const isSuccess = Math.random() > 0.1; // 90% success rate simulation

    if (!isSuccess) {
      throw new BadRequestException('Payment gateway declined the transaction.');
    }

    const transactionRef = `${data.provider}-TXN-${Date.now()}`;

    // 2. If it's for a POS Sale, generate the sale
    let sale = null;
    if (data.saleDto && data.cashierId) {
      // Force payment method to be online
      data.saleDto.paymentMethod = data.provider;
      sale = await this.salesService.checkout(data.saleDto, data.cashierId);
    }

    // 3. Record the Payment Transaction
    const pt = await this.prisma.paymentTransaction.create({
      data: {
        provider: data.provider,
        transactionRef,
        amount: data.amount,
        status: 'SUCCESS',
        saleId: sale ? sale.id : null,
      }
    });

    return {
      message: 'Payment processed successfully',
      transactionRef,
      sale
    };
  }
}
