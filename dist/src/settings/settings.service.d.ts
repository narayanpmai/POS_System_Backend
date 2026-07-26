import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: number;
        email: string;
        phone: string;
        address: string;
        updatedAt: Date;
        storeName: string;
        companyId: number;
        taxNumber: string;
        currencySymbol: string;
        receiptHeader: string;
        receiptFooter: string;
        taxRateDefault: number;
        invoicePrefix: string;
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        id: number;
        email: string;
        phone: string;
        address: string;
        updatedAt: Date;
        storeName: string;
        companyId: number;
        taxNumber: string;
        currencySymbol: string;
        receiptHeader: string;
        receiptFooter: string;
        taxRateDefault: number;
        invoicePrefix: string;
    }>;
}
