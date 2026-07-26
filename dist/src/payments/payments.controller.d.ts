import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    processPayment(req: any, body: any): Promise<{
        message: string;
        transactionRef: string;
        sale: any;
    }>;
}
