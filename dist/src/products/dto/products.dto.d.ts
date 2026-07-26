export declare class CreateCategoryDto {
    name: string;
    description?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
}
export declare class CreateProductDto {
    name: string;
    SKU: string;
    barcode?: string;
    description?: string;
    price: number;
    cost: number;
    stock: number;
    minStockAlert?: number;
    categoryId: number;
    taxRate?: number;
    image?: string;
    brandId?: number;
    unit?: string;
}
export declare class UpdateProductDto {
    name?: string;
    SKU?: string;
    barcode?: string;
    description?: string;
    price?: number;
    cost?: number;
    stock?: number;
    minStockAlert?: number;
    categoryId?: number;
    taxRate?: number;
    image?: string;
    brandId?: number;
    unit?: string;
}
