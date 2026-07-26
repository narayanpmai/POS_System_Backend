import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customers.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(req: any, dto: CreateCustomerDto): Promise<{
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
    findAll(req: any, page?: number, limit?: number, search?: string): Promise<{
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
    findByPhone(req: any, phone: string): Promise<{
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
    update(req: any, id: number, dto: UpdateCustomerDto): Promise<{
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
