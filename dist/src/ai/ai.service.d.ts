import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private prisma;
    constructor(prisma: PrismaService);
    getSalesPrediction(): Promise<{
        last30Days: number;
        predictedNext30Days: number;
        trend: string;
        confidence: number;
    }>;
    getReorderSuggestions(): Promise<any[]>;
    getSlowMovingProducts(): Promise<{
        productId: number;
        name: string;
        stock: number;
        daysUnsold: number;
        suggestion: string;
    }[]>;
}
