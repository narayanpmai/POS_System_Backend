import { PrismaService } from '../prisma/prisma.service';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<{
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
    findOne(id: number): Promise<{
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
    create(data: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
        adminName: string;
        adminEmail: string;
        adminPassword: string;
    }): Promise<{
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
    update(id: number, data: any): Promise<{
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
    deleteCompany(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCompanyPermanently(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
