import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(req: any, payload: any): Promise<{
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
}
export {};
