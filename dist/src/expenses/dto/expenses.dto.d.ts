export declare class CreateExpenseDto {
    referenceNo: string;
    category: string;
    amount: number;
    description?: string;
    date?: string;
}
export declare class UpdateExpenseDto {
    referenceNo?: string;
    category?: string;
    amount?: number;
    description?: string;
    date?: string;
}
