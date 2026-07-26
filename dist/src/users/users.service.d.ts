import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(reqUser: any): Promise<{
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
    getRoles(reqUser: any): Promise<{
        id: number;
        name: string;
        description: string | null;
    }[]>;
    create(reqUser: any, data: any): Promise<{
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
    update(reqUser: any, id: number, data: any): Promise<{
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
    remove(reqUser: any, id: number): Promise<{
        message: string;
    }>;
    resetPassword(reqUser: any, id: number, data: any): Promise<{
        message: string;
    }>;
}
