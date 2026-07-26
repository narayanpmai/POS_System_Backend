import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';
export declare class IncomesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateIncomeDto): Promise<{
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
    update(companyId: number, id: number, dto: UpdateIncomeDto): Promise<{
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
