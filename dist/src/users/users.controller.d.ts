import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any): Promise<{
        company: {
            id: number;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            logo: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        active: boolean;
        companyId: number;
    }[]>;
    getRoles(req: any): Promise<{
        id: number;
        name: string;
        description: string | null;
    }[]>;
    create(req: any, body: any): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        active: boolean;
        companyId: number;
    }>;
    update(req: any, id: number, body: any): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        active: boolean;
        companyId: number;
    }>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
    resetPassword(req: any, id: number, body: any): Promise<{
        message: string;
    }>;
}
