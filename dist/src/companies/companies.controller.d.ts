import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(req: any, includeInactive?: string): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(req: any, data: any): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: any, id: string, data: any): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: any, id: string, permanent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
