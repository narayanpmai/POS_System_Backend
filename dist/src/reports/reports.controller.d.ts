import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardSummary(req: any, queryCompanyId?: string): Promise<{
        salesCountToday: number;
        salesToday: number;
        salesThisWeek: number;
        salesThisMonth: number;
        totalSales: number;
        totalTaxCollected: number;
        totalDiscountGiven: number;
        totalTransactions: number;
        totalNetProfit: number;
        lowStockCount: number;
        lowStockAlerts: ({
            category: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                companyId: number;
                description: string | null;
            };
        } & {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
            SKU: string;
            barcode: string | null;
            price: number;
            cost: number;
            stock: number;
            minStockAlert: number;
            categoryId: number;
            taxRate: number;
            image: string | null;
            brandId: number | null;
            unit: string;
        })[];
        topSellingProducts: {
            name: string;
            quantity: number;
            revenue: number;
        }[];
        recentTransactions: ({
            customer: {
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
            };
            cashier: {
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            companyId: number;
            customerId: number | null;
            paymentMethod: string;
            discountAmount: number;
            invoiceNo: string;
            subtotal: number;
            taxAmount: number;
            totalAmount: number;
            paymentStatus: string;
            cashierId: number;
        })[];
    }>;
    getSalesAnalytics(req: any, startDate?: string, endDate?: string, queryCompanyId?: string): Promise<{
        startDate: string;
        endDate: string;
        totalSales: number;
        totalProfit: number;
        totalTransactions: number;
        timeline: {
            date: string;
            sales: number;
            profit: number;
            transactions: number;
        }[];
    }>;
    getInventoryReport(req: any): Promise<{
        totalValuation: number;
        totalRetailValuation: number;
        totalItemsCount: number;
        lowStockItemsCount: number;
        items: {
            id: number;
            name: string;
            SKU: string;
            category: string;
            stock: number;
            minStockAlert: number;
            isLowStock: boolean;
            price: number;
            cost: number;
            unit: string;
            valuation: number;
            retailValuation: number;
        }[];
    }>;
    getFinancialReport(req: any): Promise<{
        timeline: {
            fiscalYear: string;
            income: number;
            cogs: number;
            operational: number;
            capital: number;
            unexpected: number;
            netProfit: number;
        }[];
        insights: {
            projectedIncome: number;
            projectedExpenditure: number;
            recommendations: string[];
        };
    }>;
    getDailySummary(req: any, startDate?: string, endDate?: string): Promise<{
        startDate: string;
        endDate: string;
        totalIncome: number;
        salesCount: number;
        totalIncomes: number;
        totalInvestments: number;
        incomesCount: number;
        totalExpenses: number;
        expensesCount: number;
        totalPurchases: number;
        purchasesCount: number;
        netProfit: number;
        timeline: {
            date: string;
            income: number;
            outflow: number;
            investment: number;
        }[];
        recentSales: ({
            customer: {
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
            };
        } & {
            id: number;
            createdAt: Date;
            companyId: number;
            customerId: number | null;
            paymentMethod: string;
            discountAmount: number;
            invoiceNo: string;
            subtotal: number;
            taxAmount: number;
            totalAmount: number;
            paymentStatus: string;
            cashierId: number;
        })[];
        recentIncomes: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
            category: string;
            amount: number;
            referenceNo: string | null;
            date: Date;
        }[];
        recentExpenses: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            description: string | null;
            category: string;
            amount: number;
            referenceNo: string | null;
            date: Date;
        }[];
    }>;
    getClosingStock(req: any): Promise<{
        products: any[];
        totalValue: number;
        fiscalYear?: undefined;
        endDate?: undefined;
    } | {
        fiscalYear: string;
        endDate: Date;
        products: any[];
        totalValue: number;
    }>;
    getClosingBalance(req: any): Promise<{
        openingBalance: number;
        totalIncome: number;
        totalExpenses: number;
        closingBalance: number;
        fiscalYear?: undefined;
    } | {
        fiscalYear: string;
        openingBalance: number;
        totalIncome: number;
        totalExpenses: number;
        closingBalance: number;
    }>;
}
