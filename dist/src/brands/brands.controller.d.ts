import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(req: any, dto: CreateBrandDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    findAll(req: any, search?: string, queryCompanyId?: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }[]>;
    findOne(req: any, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    update(req: any, id: number, dto: UpdateBrandDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    remove(req: any, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
}
