import { AccountingService } from './accounting.service';
export declare class AccountingController {
    private readonly accountingService;
    constructor(accountingService: AccountingService);
    getAccounts(req: any): Promise<{
        id: number;
        name: string;
        companyId: number;
        description: string | null;
        code: string;
        type: string;
        balance: number;
    }[]>;
    createAccount(req: any, data: any): Promise<{
        id: number;
        name: string;
        companyId: number;
        description: string | null;
        code: string;
        type: string;
        balance: number;
    }>;
    getJournalEntries(req: any): Promise<({
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
    createJournalEntry(req: any, data: any): Promise<{
        id: number;
        companyId: number;
        description: string;
        referenceNo: string | null;
        date: Date;
    }>;
    getTrialBalance(req: any): Promise<{
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
