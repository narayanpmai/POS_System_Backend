import { PrismaService } from '../prisma/prisma.service';
export declare class CrmService {
    private prisma;
    constructor(prisma: PrismaService);
    getTiers(): Promise<{
        id: number;
        name: string;
        companyId: number;
        minPoints: number;
        discountPercent: number;
    }[]>;
    getCustomerCrmData(customerId: number): Promise<{
        rewardPointHistories: {
            id: number;
            createdAt: Date;
            companyId: number;
            reason: string | null;
            customerId: number;
            points: number;
        }[];
        membershipTier: {
            id: number;
            name: string;
            companyId: number;
            minPoints: number;
            discountPercent: number;
        };
    } & {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    adjustWallet(customerId: number, amount: number, reason: string): Promise<{
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
    addRewardPoints(customerId: number, points: number, reason: string): Promise<{
        membershipTier: {
            id: number;
            name: string;
            companyId: number;
            minPoints: number;
            discountPercent: number;
        };
    } & {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        points: number;
        walletBalance: number;
        membershipTierId: number | null;
    }>;
}
