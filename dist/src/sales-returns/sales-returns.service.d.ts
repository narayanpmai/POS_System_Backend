import { PrismaService } from '../prisma/prisma.service';
export declare class SalesReturnsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, userId: number, dto: any): Promise<{
        items: {
            id: number;
            quantity: number;
            refundAmount: number;
            saleItemId: number;
            saleReturnId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        customerId: number | null;
        totalAmount: number;
        saleId: number;
        returnNo: string;
        returnDate: Date;
    }>;
    findAll(companyId: number): Promise<({
        customer: {
            name: string;
        };
        sale: {
            invoiceNo: string;
        };
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        customerId: number | null;
        totalAmount: number;
        saleId: number;
        returnNo: string;
        returnDate: Date;
    })[]>;
    findOne(companyId: number, id: number): Promise<{
        customer: {
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
        };
        sale: {
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
        };
        items: ({
            saleItem: {
                product: {
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    companyId: number;
                    description: string | null;
                    SKU: string;
                    barcode: string | null;
                    price: number;
                    cost: number;
                    stock: number;
                    minStockAlert: number;
                    categoryId: number;
                    taxRate: number;
                    image: string | null;
                    brandId: number | null;
                    unit: string;
                };
            } & {
                id: number;
                price: number;
                cost: number;
                total: number;
                quantity: number;
                productId: number;
                taxAmount: number;
                saleId: number;
            };
        } & {
            id: number;
            quantity: number;
            refundAmount: number;
            saleItemId: number;
            saleReturnId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        customerId: number | null;
        totalAmount: number;
        saleId: number;
        returnNo: string;
        returnDate: Date;
    }>;
}
