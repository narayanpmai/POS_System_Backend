import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateExpenseDto): Promise<{
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
    findAll(companyId: number, search?: string, category?: string): Promise<{
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
    findOne(companyId: number, id: number): Promise<{
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
    update(companyId: number, id: number, dto: UpdateExpenseDto): Promise<{
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
    remove(companyId: number, id: number): Promise<{
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
