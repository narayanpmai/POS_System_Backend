import { PrismaService } from '../prisma/prisma.service';
export declare class PurchaseReturnsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, userId: number, dto: any): Promise<{
        items: {
            id: number;
            quantity: number;
            refundAmount: number;
            purchaseItemId: number;
            purchaseReturnId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        supplierId: number;
        totalAmount: number;
        purchaseId: number;
        returnNo: string;
        returnDate: Date;
    }>;
    findAll(companyId: number): Promise<({
        supplier: {
            name: string;
        };
        purchase: {
            poNumber: string;
        };
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        supplierId: number;
        totalAmount: number;
        purchaseId: number;
        returnNo: string;
        returnDate: Date;
    })[]>;
    findOne(companyId: number, id: number): Promise<{
        supplier: {
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            contactName: string | null;
        };
        purchase: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            supplierId: number | null;
            userId: number;
            totalAmount: number;
            status: string;
            poNumber: string;
            purchaseDate: Date;
        };
        items: ({
            purchaseItem: {
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
                total: number;
                quantity: number;
                productId: number;
                purchaseId: number;
                costPrice: number;
                measurementUnit: string;
            };
        } & {
            id: number;
            quantity: number;
            refundAmount: number;
            purchaseItemId: number;
            purchaseReturnId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        companyId: number;
        reason: string | null;
        supplierId: number;
        totalAmount: number;
        purchaseId: number;
        returnNo: string;
        returnDate: Date;
    }>;
}
