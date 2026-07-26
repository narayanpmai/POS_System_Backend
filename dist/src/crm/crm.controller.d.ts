import { CrmService } from './crm.service';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    getTiers(): Promise<{
        id: number;
        name: string;
        companyId: number;
        minPoints: number;
        discountPercent: number;
    }[]>;
    getCustomerCrmData(id: string): Promise<{
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
    adjustWallet(id: string, body: {
        amount: number;
        reason: string;
    }): Promise<{
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
    addRewardPoints(id: string, body: {
        points: number;
        reason: string;
    }): Promise<{
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
