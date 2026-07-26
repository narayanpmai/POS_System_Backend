import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sales.dto';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    checkout(companyId: number, dto: CreateSaleDto, cashierId: number): Promise<{
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
        items: ({
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
        })[];
        cashier: {
            name: string;
            email: string;
        };
    } & {
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
    }>;
    findAllSales(companyId: number, query: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
        categoryId?: string;
    }): Promise<{
        items: ({
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
            items: ({
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
            })[];
            cashier: {
                name: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        totalSalesAmount: number;
    }>;
    findSaleById(companyId: number, id: number): Promise<{
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
        items: ({
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
        })[];
        cashier: {
            name: string;
            email: string;
        };
    } & {
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
    }>;
    remove(companyId: number, id: number, adminId: number): Promise<{
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
    }>;
    clearAllSales(companyId: number): Promise<{
        message: string;
    }>;
    getDeletedSales(companyId: number): Promise<{
        items: any;
        id: number;
        companyId: number;
        invoiceNo: string;
        totalAmount: number;
        originalSaleId: number;
        customerName: string | null;
        cashierName: string | null;
        itemsSnapshot: string;
        deletedAt: Date;
        deletedById: number;
    }[]>;
}
