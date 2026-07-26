import { ExpenseCategoriesService } from './expense-categories.service';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-categories.dto';
export declare class ExpenseCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: ExpenseCategoriesService);
    create(req: any, dto: CreateExpenseCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    findAll(req: any, search?: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }[]>;
    findOne(req: any, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    update(req: any, id: number, dto: UpdateExpenseCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
    remove(req: any, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        description: string | null;
    }>;
}
