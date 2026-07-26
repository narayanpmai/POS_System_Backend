import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/suppliers.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(req: any, dto: CreateSupplierDto): Promise<{
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
    findAll(req: any, page?: number, limit?: number, search?: string): Promise<{
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
    findOne(req: any, id: number): Promise<{
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
    update(req: any, id: number, dto: UpdateSupplierDto): Promise<{
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
    remove(req: any, id: number): Promise<{
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
