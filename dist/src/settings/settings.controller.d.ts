import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    private prismaGet;
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
