import { PrismaService } from '../prisma/prisma.service';
export declare class PurchasesService {
    private prisma;
    constructor(prisma: PrismaService);
    createPurchase(companyId: number, data: any, userId: number): Promise<{
        items: {
            id: number;
            total: number;
            quantity: number;
            productId: number;
            purchaseId: number;
            costPrice: number;
            measurementUnit: string;
        }[];
    } & {
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
    }>;
    updatePurchase(companyId: number, id: number, data: any, userId: number): Promise<{
        items: {
            id: number;
            total: number;
            quantity: number;
            productId: number;
            purchaseId: number;
            costPrice: number;
            measurementUnit: string;
        }[];
    } & {
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
    }>;
    findAll(companyId: number): Promise<({
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            roleId: number;
            active: boolean;
            companyId: number;
        };
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
            total: number;
            quantity: number;
            productId: number;
            purchaseId: number;
            costPrice: number;
            measurementUnit: string;
        })[];
    } & {
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
    })[]>;
}
