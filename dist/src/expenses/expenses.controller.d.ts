import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(req: any, dto: CreateExpenseDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
        category: string;
        amount: number;
        referenceNo: string | null;
        date: Date;
    }>;
    findAll(req: any, search?: string, category?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
        category: string;
        amount: number;
        referenceNo: string | null;
        date: Date;
    }[]>;
    findOne(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
        category: string;
        amount: number;
        referenceNo: string | null;
        date: Date;
    }>;
    update(req: any, id: number, dto: UpdateExpenseDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
        category: string;
        amount: number;
        referenceNo: string | null;
        date: Date;
    }>;
    remove(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
        category: string;
        amount: number;
        referenceNo: string | null;
        date: Date;
    }>;
}
