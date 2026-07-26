import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/suppliers.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateSupplierDto): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        contactName: string | null;
    }>;
    findAll(companyId: number, search?: string, page?: number, limit?: number): Promise<{
        items: {
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            contactName: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        contactName: string | null;
    }>;
    update(companyId: number, id: number, dto: UpdateSupplierDto): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        contactName: string | null;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        contactName: string | null;
    }>;
}
