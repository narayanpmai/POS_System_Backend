import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
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
