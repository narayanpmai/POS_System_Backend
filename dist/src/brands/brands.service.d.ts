import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateBrandDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    findAll(companyId: number, search?: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }[]>;
    findOne(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    update(companyId: number, id: number, dto: UpdateBrandDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        status: string;
        slug: string;
    }>;
}
