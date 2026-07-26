import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(companyId: number, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    findAllCategories(companyId: number): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    })[]>;
    findCategoryById(companyId: number, id: number): Promise<{
        products: {
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
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    updateCategory(companyId: number, id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    removeCategory(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    createProduct(companyId: number, dto: CreateProductDto, userId: number): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
        };
    } & {
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
    }>;
    findAllProducts(companyId: number, query: {
        page?: number;
        limit?: number;
        search?: string;
        categoryId?: number;
        lowStockOnly?: boolean;
    }): Promise<{
        items: ({
            category: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                companyId: number;
                description: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        lowStockCount: number;
    }>;
    findProductById(companyId: number, id: number): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
        };
    } & {
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
    }>;
    findProductByBarcode(companyId: number, barcode: string): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
        };
    } & {
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
    }>;
    updateProduct(companyId: number, id: number, dto: UpdateProductDto): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
        };
    } & {
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
    }>;
    removeProduct(companyId: number, id: number): Promise<{
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
    }>;
    updateStockManually(companyId: number, id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, userId: number): Promise<{
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
    }>;
}
