import { PrismaService } from '../prisma/prisma.service';
export declare class AccountingService {
    private prisma;
    constructor(prisma: PrismaService);
    getAccounts(companyId: number): Promise<{
        id: number;
        name: string;
        companyId: number;
        description: string | null;
        code: string;
        type: string;
        balance: number;
    }[]>;
    createAccount(companyId: number, data: any): Promise<{
        id: number;
        name: string;
        companyId: number;
        description: string | null;
        code: string;
        type: string;
        balance: number;
    }>;
    getJournalEntries(companyId: number): Promise<({
        lines: ({
            account: {
                id: number;
                name: string;
                companyId: number;
                description: string | null;
                code: string;
                type: string;
                balance: number;
            };
        } & {
            id: number;
            description: string | null;
            debit: number;
            credit: number;
            accountId: number;
            journalEntryId: number;
        })[];
    } & {
        id: number;
        companyId: number;
        description: string;
        referenceNo: string | null;
        date: Date;
    })[]>;
    createJournalEntry(companyId: number, data: {
        description: string;
        referenceNo?: string;
        lines: {
            accountId: number;
            debit: number;
            credit: number;
            description?: string;
        }[];
    }): Promise<{
        id: number;
        companyId: number;
        description: string;
        referenceNo: string | null;
        date: Date;
    }>;
    getTrialBalance(companyId: number): Promise<{
        totalDebit: number;
        totalCredit: number;
        balance: number;
        id: number;
        name: string;
        companyId: number;
        description: string | null;
        code: string;
        type: string;
    }[]>;
}
