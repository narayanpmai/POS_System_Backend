import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-categories.dto';
export declare class ExpenseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateExpenseCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    findAll(companyId: number, search?: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }[]>;
    findOne(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    update(companyId: number, id: number, dto: UpdateExpenseCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
}
