import { IncomesService } from './incomes.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';
export declare class IncomesController {
    private readonly incomesService;
    constructor(incomesService: IncomesService);
    create(req: any, dto: CreateIncomeDto): Promise<{
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
    update(req: any, id: number, dto: UpdateIncomeDto): Promise<{
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
