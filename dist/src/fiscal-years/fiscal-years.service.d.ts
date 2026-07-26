import { PrismaService } from '../prisma/prisma.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';
export declare class FiscalYearsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    findActive(companyId: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    create(companyId: number, createDto: CreateFiscalYearDto): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    update(companyId: number, id: number, updateDto: UpdateFiscalYearDto): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    setActive(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    delete(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
}
