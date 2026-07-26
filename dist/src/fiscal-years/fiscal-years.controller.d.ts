import { FiscalYearsService } from './fiscal-years.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';
export declare class FiscalYearsController {
    private readonly fiscalYearsService;
    constructor(fiscalYearsService: FiscalYearsService);
    findAll(req: any): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    findActive(req: any): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    create(req: any, createDto: CreateFiscalYearDto): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    update(req: any, id: number, updateDto: UpdateFiscalYearDto): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    setActive(req: any, id: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        startDate: Date;
        endDate: Date;
    }>;
    delete(req: any, id: number): Promise<{
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
