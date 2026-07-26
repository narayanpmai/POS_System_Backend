import { PrismaService } from '../prisma/prisma.service';
import { SalesService } from '../sales/sales.service';
export declare class PaymentsService {
    private prisma;
    private salesService;
    constructor(prisma: PrismaService, salesService: SalesService);
    processPayment(companyId: number, data: {
        amount: number;
        provider: string;
        sourceToken: string;
        saleDto?: any;
        cashierId?: number;
    }): Promise<{
        message: string;
        transactionRef: string;
        sale: any;
    }>;
}
