import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sales.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    checkout(dto: CreateSaleDto, req: any): Promise<{
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
    findAllSales(req: any, page?: number, limit?: number, search?: string, startDate?: string, endDate?: string, categoryId?: string): Promise<{
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
    getDeletedSales(req: any): Promise<{
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
    findSaleById(req: any, id: number): Promise<{
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
    clearAllSales(req: any): Promise<{
        message: string;
    }>;
    remove(id: number, req: any): Promise<{
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
}
