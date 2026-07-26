import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto } from './dto/income-categories.dto';
export declare class IncomeCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateIncomeCategoryDto): Promise<{
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
    update(companyId: number, id: number, dto: UpdateIncomeCategoryDto): Promise<{
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
