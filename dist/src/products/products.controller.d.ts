import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createCategory(req: any, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    findAllCategories(req: any, queryCompanyId?: string): Promise<({
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
    findCategoryById(req: any, id: number): Promise<{
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
    updateCategory(req: any, id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    removeCategory(req: any, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    createProduct(dto: CreateProductDto, req: any): Promise<{
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
    findAllProducts(req: any, page?: number, limit?: number, search?: string, categoryId?: number, lowStockOnly?: boolean, queryCompanyId?: string): Promise<{
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
    findProductByBarcode(req: any, barcode: string): Promise<{
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
    findProductById(req: any, id: number): Promise<{
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
    updateProduct(req: any, id: number, dto: UpdateProductDto): Promise<{
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
    removeProduct(req: any, id: number): Promise<{
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
    updateStockManually(id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, req: any): Promise<{
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
