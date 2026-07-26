"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardSummary(companyId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
        const globalDateFilter = activeFy ? { gte: activeFy.startDate, lte: activeFy.endDate } : undefined;
        const [dailySales, weeklySales, monthlySales, totalSalesSum] = await Promise.all([
            this.prisma.sale.aggregate({
                where: { createdAt: { gte: today }, companyId },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),
            this.prisma.sale.aggregate({
                where: { createdAt: { gte: startOfWeek }, companyId },
                _sum: { totalAmount: true },
            }),
            this.prisma.sale.aggregate({
                where: { createdAt: { gte: startOfMonth }, companyId },
                _sum: { totalAmount: true },
            }),
            this.prisma.sale.aggregate({
                where: globalDateFilter ? { createdAt: globalDateFilter, companyId } : { companyId },
                _sum: { totalAmount: true, taxAmount: true, discountAmount: true },
                _count: { id: true },
            }),
        ]);
        const totalSaleItemsCost = await this.prisma.saleItem.findMany({
            where: globalDateFilter ? { sale: { createdAt: globalDateFilter, companyId } } : { sale: { companyId } },
            select: {
                quantity: true,
                cost: true,
                total: true,
            },
        });
        let totalCost = 0;
        let totalRevenue = 0;
        for (const item of totalSaleItemsCost) {
            totalCost += item.quantity * item.cost;
            totalRevenue += item.total;
        }
        const netProfit = totalRevenue - totalCost;
        const allProducts = await this.prisma.product.findMany({
            where: { companyId },
            include: { category: true },
        });
        const lowStockAlerts = allProducts.filter(p => p.stock <= p.minStockAlert).slice(0, 5);
        const lowStockCount = allProducts.filter(p => p.stock <= p.minStockAlert).length;
        const saleItems = await this.prisma.saleItem.findMany({
            where: globalDateFilter ? { sale: { createdAt: globalDateFilter, companyId } } : { sale: { companyId } },
            include: { product: true },
        });
        const productSalesMap = {};
        for (const item of saleItems) {
            const pId = item.productId;
            if (!productSalesMap[pId]) {
                productSalesMap[pId] = { name: item.product.name, quantity: 0, revenue: 0 };
            }
            productSalesMap[pId].quantity += item.quantity;
            productSalesMap[pId].revenue += item.total;
        }
        const topSellingProducts = Object.values(productSalesMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
        const recentTransactions = await this.prisma.sale.findMany({
            where: globalDateFilter ? { createdAt: globalDateFilter, companyId } : { companyId },
            include: {
                customer: true,
                cashier: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return {
            salesCountToday: dailySales._count.id || 0,
            salesToday: dailySales._sum.totalAmount || 0,
            salesThisWeek: weeklySales._sum.totalAmount || 0,
            salesThisMonth: monthlySales._sum.totalAmount || 0,
            totalSales: totalSalesSum._sum.totalAmount || 0,
            totalTaxCollected: totalSalesSum._sum.taxAmount || 0,
            totalDiscountGiven: totalSalesSum._sum.discountAmount || 0,
            totalTransactions: totalSalesSum._count.id || 0,
            totalNetProfit: Number(netProfit.toFixed(2)),
            lowStockCount,
            lowStockAlerts,
            topSellingProducts,
            recentTransactions,
        };
    }
    async getSalesAnalytics(companyId, startDateStr, endDateStr) {
        let end = endDateStr ? new Date(endDateStr) : new Date();
        let start = startDateStr ? new Date(startDateStr) : new Date();
        if (!startDateStr && !endDateStr) {
            const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
            if (activeFy) {
                const today = new Date();
                if (today > activeFy.endDate) {
                    end = new Date(activeFy.endDate);
                }
                else if (today < activeFy.startDate) {
                    end = new Date(activeFy.startDate);
                    end.setDate(end.getDate() + 7);
                }
                else {
                    end = today;
                }
                start = new Date(end);
                start.setDate(start.getDate() - 7);
            }
            else {
                start.setDate(start.getDate() - 7);
            }
        }
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        const sales = await this.prisma.sale.findMany({
            where: {
                companyId,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const dailyDataMap = {};
        const currentIter = new Date(start);
        while (currentIter <= end) {
            const dateKey = currentIter.toISOString().split('T')[0];
            dailyDataMap[dateKey] = {
                date: dateKey,
                sales: 0,
                profit: 0,
                transactions: 0,
            };
            currentIter.setDate(currentIter.getDate() + 1);
        }
        for (const sale of sales) {
            const dateKey = sale.createdAt.toISOString().split('T')[0];
            if (!dailyDataMap[dateKey]) {
                dailyDataMap[dateKey] = { date: dateKey, sales: 0, profit: 0, transactions: 0 };
            }
            dailyDataMap[dateKey].sales += sale.totalAmount;
            dailyDataMap[dateKey].transactions += 1;
            let saleCost = 0;
            for (const item of sale.items) {
                saleCost += item.quantity * item.cost;
            }
            dailyDataMap[dateKey].profit += (sale.totalAmount - saleCost);
        }
        const timeline = Object.values(dailyDataMap).sort((a, b) => a.date.localeCompare(b.date));
        let totalSales = 0;
        let totalProfit = 0;
        let totalTransactions = 0;
        for (const day of timeline) {
            totalSales += day.sales;
            totalProfit += day.profit;
            totalTransactions += day.transactions;
            day.sales = Number(day.sales.toFixed(2));
            day.profit = Number(day.profit.toFixed(2));
        }
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            totalSales: Number(totalSales.toFixed(2)),
            totalProfit: Number(totalProfit.toFixed(2)),
            totalTransactions,
            timeline,
        };
    }
    async getFinancialReport(companyId) {
        const sales = await this.prisma.sale.findMany({
            where: { companyId },
            include: { items: true }
        });
        const expenses = await this.prisma.expense.findMany({
            where: { companyId }
        });
        const getFiscalYear = (date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            if (month < 6 || (month === 6 && day < 16)) {
                return `${year - 1}/${year.toString().slice(-2)}`;
            }
            else {
                return `${year}/${(year + 1).toString().slice(-2)}`;
            }
        };
        const fyDataMap = {};
        for (const sale of sales) {
            const fy = getFiscalYear(sale.createdAt);
            if (!fyDataMap[fy]) {
                fyDataMap[fy] = { fiscalYear: fy, income: 0, cogs: 0, operational: 0, capital: 0, unexpected: 0, netProfit: 0 };
            }
            fyDataMap[fy].income += sale.totalAmount;
            let saleCost = 0;
            for (const item of sale.items) {
                saleCost += item.quantity * item.cost;
            }
            fyDataMap[fy].cogs += saleCost;
        }
        for (const expense of expenses) {
            const fy = getFiscalYear(expense.date);
            if (!fyDataMap[fy]) {
                fyDataMap[fy] = { fiscalYear: fy, income: 0, cogs: 0, operational: 0, capital: 0, unexpected: 0, netProfit: 0 };
            }
            if (expense.category === 'OPERATIONAL')
                fyDataMap[fy].operational += expense.amount;
            else if (expense.category === 'CAPITAL')
                fyDataMap[fy].capital += expense.amount;
            else if (expense.category === 'UNEXPECTED')
                fyDataMap[fy].unexpected += expense.amount;
        }
        const timeline = Object.values(fyDataMap).sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));
        for (const fy of timeline) {
            fy.netProfit = fy.income - fy.cogs - fy.operational - fy.capital - fy.unexpected;
            fy.income = Number(fy.income.toFixed(2));
            fy.cogs = Number(fy.cogs.toFixed(2));
            fy.operational = Number(fy.operational.toFixed(2));
            fy.capital = Number(fy.capital.toFixed(2));
            fy.unexpected = Number(fy.unexpected.toFixed(2));
            fy.netProfit = Number(fy.netProfit.toFixed(2));
        }
        let projectedIncome = 0;
        let projectedExpenditure = 0;
        if (timeline.length >= 2) {
            const last = timeline[timeline.length - 1];
            const prev = timeline[timeline.length - 2];
            const incomeGrowth = prev.income > 0 ? (last.income - prev.income) / prev.income : 0;
            const expLast = last.operational + last.capital + last.unexpected;
            const expPrev = prev.operational + prev.capital + prev.unexpected;
            const expGrowth = expPrev > 0 ? (expLast - expPrev) / expPrev : 0;
            projectedIncome = Number((last.income * (1 + incomeGrowth)).toFixed(2));
            projectedExpenditure = Number((expLast * (1 + expGrowth)).toFixed(2));
        }
        else if (timeline.length === 1) {
            const last = timeline[0];
            projectedIncome = Number((last.income * 1.1).toFixed(2));
            projectedExpenditure = Number(((last.operational + last.capital + last.unexpected) * 1.05).toFixed(2));
        }
        return {
            timeline,
            insights: {
                projectedIncome,
                projectedExpenditure,
                recommendations: [
                    "Renegotiate operational expenses (like internet and rent) if the YoY operational cost is increasing by more than 5%.",
                    "Promote high-margin hardware/electronic products to boost Net Profit margin.",
                    "Cap unexpected expenses by scheduling preventive maintenance for store equipment.",
                    "Consider adopting a tiered loyalty points system to encourage repeat Walk-In customers and stabilize income."
                ]
            }
        };
    }
    async getInventoryReport(companyId) {
        const products = await this.prisma.product.findMany({
            where: { companyId },
            include: {
                category: true,
                _count: {
                    select: { saleItems: true }
                }
            },
            orderBy: { stock: 'asc' },
        });
        const stockSummary = products.map((p) => {
            const isLowStock = p.stock <= p.minStockAlert;
            return {
                id: p.id,
                name: p.name,
                SKU: p.SKU,
                category: p.category.name,
                stock: p.stock,
                minStockAlert: p.minStockAlert,
                isLowStock,
                price: p.price,
                cost: p.cost,
                unit: p.unit,
                valuation: Number((p.stock * p.cost).toFixed(2)),
                retailValuation: Number((p.stock * p.price).toFixed(2)),
            };
        });
        const totalValuation = stockSummary.reduce((acc, curr) => acc + curr.valuation, 0);
        const totalRetailValuation = stockSummary.reduce((acc, curr) => acc + curr.retailValuation, 0);
        return {
            totalValuation: Number(totalValuation.toFixed(2)),
            totalRetailValuation: Number(totalRetailValuation.toFixed(2)),
            totalItemsCount: products.length,
            lowStockItemsCount: products.filter((p) => p.stock <= p.minStockAlert).length,
            items: stockSummary,
        };
    }
    async getDailySummary(companyId, startDateStr, endDateStr) {
        const end = endDateStr ? new Date(endDateStr) : new Date();
        const start = startDateStr ? new Date(startDateStr) : new Date();
        if (!startDateStr) {
            start.setDate(start.getDate() - 30);
        }
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        const [sales, expenses, incomes, purchases] = await Promise.all([
            this.prisma.sale.findMany({
                where: {
                    companyId,
                    createdAt: { gte: start, lte: end }
                },
                include: {
                    customer: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.expense.findMany({
                where: {
                    companyId,
                    date: { gte: start, lte: end }
                },
                orderBy: { date: 'desc' }
            }),
            this.prisma.income.findMany({
                where: {
                    companyId,
                    date: { gte: start, lte: end }
                },
                orderBy: { date: 'desc' }
            }),
            this.prisma.purchase.findMany({
                where: {
                    companyId,
                    purchaseDate: { gte: start, lte: end }
                },
                orderBy: { purchaseDate: 'desc' }
            })
        ]);
        const totalSalesAmount = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalExpensesAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalInvestmentsAmount = incomes.filter(i => i.category.toLowerCase() === 'investment' || i.category.toLowerCase() === 'capital').reduce((acc, curr) => acc + curr.amount, 0);
        const totalOtherIncomesAmount = incomes.filter(i => i.category.toLowerCase() !== 'investment' && i.category.toLowerCase() !== 'capital').reduce((acc, curr) => acc + curr.amount, 0);
        const totalIncomesAmount = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalPurchasesAmount = purchases.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const netProfit = totalSalesAmount + totalIncomesAmount - totalExpensesAmount - totalPurchasesAmount;
        const dailyDataMap = {};
        const currentIter = new Date(start);
        while (currentIter <= end) {
            const dateKey = currentIter.toISOString().split('T')[0];
            dailyDataMap[dateKey] = {
                date: dateKey,
                income: 0,
                outflow: 0,
                investment: 0
            };
            currentIter.setDate(currentIter.getDate() + 1);
        }
        for (const sale of sales) {
            const dateKey = sale.createdAt.toISOString().split('T')[0];
            if (dailyDataMap[dateKey]) {
                dailyDataMap[dateKey].income += sale.totalAmount;
            }
        }
        for (const exp of expenses) {
            const dateKey = exp.date.toISOString().split('T')[0];
            if (dailyDataMap[dateKey]) {
                dailyDataMap[dateKey].outflow += exp.amount;
            }
        }
        for (const pur of purchases) {
            const dateKey = pur.purchaseDate.toISOString().split('T')[0];
            if (dailyDataMap[dateKey]) {
                dailyDataMap[dateKey].outflow += pur.totalAmount;
            }
        }
        for (const inc of incomes) {
            const dateKey = inc.date.toISOString().split('T')[0];
            if (dailyDataMap[dateKey]) {
                dailyDataMap[dateKey].investment += inc.amount;
            }
        }
        const timeline = Object.values(dailyDataMap).sort((a, b) => a.date.localeCompare(b.date));
        for (const day of timeline) {
            day.income = Number(day.income.toFixed(2));
            day.outflow = Number(day.outflow.toFixed(2));
            day.investment = Number(day.investment.toFixed(2));
        }
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            totalIncome: Number(totalSalesAmount.toFixed(2)),
            salesCount: sales.length,
            totalIncomes: Number(totalOtherIncomesAmount.toFixed(2)),
            totalInvestments: Number(totalInvestmentsAmount.toFixed(2)),
            incomesCount: incomes.length,
            totalExpenses: Number(totalExpensesAmount.toFixed(2)),
            expensesCount: expenses.length,
            totalPurchases: Number(totalPurchasesAmount.toFixed(2)),
            purchasesCount: purchases.length,
            netProfit: Number(netProfit.toFixed(2)),
            timeline,
            recentSales: sales,
            recentIncomes: incomes,
            recentExpenses: expenses
        };
    }
    async getClosingStock(companyId) {
        const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
        if (!activeFy) {
            return { products: [], totalValue: 0 };
        }
        const products = await this.prisma.product.findMany({
            where: { companyId },
            select: { id: true, name: true, SKU: true, cost: true, price: true }
        });
        const closingStockData = [];
        let grandTotalValue = 0;
        for (const prod of products) {
            const inSum = await this.prisma.purchaseItem.aggregate({
                where: { productId: prod.id, purchase: { purchaseDate: { lte: activeFy.endDate } } },
                _sum: { quantity: true }
            });
            const outSum = await this.prisma.saleItem.aggregate({
                where: { productId: prod.id, sale: { createdAt: { lte: activeFy.endDate } } },
                _sum: { quantity: true }
            });
            const qtyIn = inSum._sum.quantity || 0;
            const qtyOut = outSum._sum.quantity || 0;
            const closingQty = qtyIn - qtyOut;
            if (closingQty > 0) {
                const totalValue = closingQty * prod.cost;
                grandTotalValue += totalValue;
                closingStockData.push({
                    ...prod,
                    closingQuantity: closingQty,
                    totalValue: Number(totalValue.toFixed(2))
                });
            }
        }
        return {
            fiscalYear: activeFy.name,
            endDate: activeFy.endDate,
            products: closingStockData,
            totalValue: Number(grandTotalValue.toFixed(2))
        };
    }
    async getClosingBalance(companyId) {
        const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
        if (!activeFy) {
            return { openingBalance: 0, totalIncome: 0, totalExpenses: 0, closingBalance: 0 };
        }
        const [pastSales, pastExpenses, pastIncomes, pastPurchases] = await Promise.all([
            this.prisma.sale.aggregate({
                where: { companyId, createdAt: { lt: activeFy.startDate } },
                _sum: { totalAmount: true }
            }),
            this.prisma.expense.aggregate({
                where: { companyId, date: { lt: activeFy.startDate } },
                _sum: { amount: true }
            }),
            this.prisma.income.aggregate({
                where: { companyId, date: { lt: activeFy.startDate } },
                _sum: { amount: true }
            }),
            this.prisma.purchase.aggregate({
                where: { companyId, purchaseDate: { lt: activeFy.startDate } },
                _sum: { totalAmount: true }
            })
        ]);
        const pastIncome = (pastSales._sum.totalAmount || 0) + (pastIncomes._sum.amount || 0);
        const pastOutflow = (pastExpenses._sum.amount || 0) + (pastPurchases._sum.totalAmount || 0);
        const openingBalance = pastIncome - pastOutflow;
        const [fySales, fyExpenses, fyIncomes, fyPurchases] = await Promise.all([
            this.prisma.sale.aggregate({
                where: { companyId, createdAt: { gte: activeFy.startDate, lte: activeFy.endDate } },
                _sum: { totalAmount: true }
            }),
            this.prisma.expense.aggregate({
                where: { companyId, date: { gte: activeFy.startDate, lte: activeFy.endDate } },
                _sum: { amount: true }
            }),
            this.prisma.income.aggregate({
                where: { companyId, date: { gte: activeFy.startDate, lte: activeFy.endDate } },
                _sum: { amount: true }
            }),
            this.prisma.purchase.aggregate({
                where: { companyId, purchaseDate: { gte: activeFy.startDate, lte: activeFy.endDate } },
                _sum: { totalAmount: true }
            })
        ]);
        const totalIncome = (fySales._sum.totalAmount || 0) + (fyIncomes._sum.amount || 0);
        const totalExpenses = (fyExpenses._sum.amount || 0) + (fyPurchases._sum.totalAmount || 0);
        const closingBalance = openingBalance + totalIncome - totalExpenses;
        return {
            fiscalYear: activeFy.name,
            openingBalance: Number(openingBalance.toFixed(2)),
            totalIncome: Number(totalIncome.toFixed(2)),
            totalExpenses: Number(totalExpenses.toFixed(2)),
            closingBalance: Number(closingBalance.toFixed(2))
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map