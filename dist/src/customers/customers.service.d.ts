import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customers.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateCustomerDto): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    findAll(companyId: number, query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: ({
            membershipTier: {
                id: number;
                name: string;
                companyId: number;
                minPoints: number;
                discountPercent: number;
            };
        } & {
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            points: number;
            walletBalance: number;
            membershipTierId: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        sales: {
            id: number;
            createdAt: Date;
            companyId: number;
            customerId: number | null;
            paymentMethod: string;
            discountAmount: number;
            invoiceNo: string;
            subtotal: number;
            taxAmount: number;
            totalAmount: number;
            paymentStatus: string;
            cashierId: number;
        }[];
    } & {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    findByPhone(companyId: number, phone: string): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    update(companyId: number, id: number, dto: UpdateCustomerDto): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
}
