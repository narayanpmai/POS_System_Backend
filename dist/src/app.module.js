"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tenant_middleware_1 = require("./auth/tenant.middleware");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const sales_module_1 = require("./sales/sales.module");
const customers_module_1 = require("./customers/customers.module");
const reports_module_1 = require("./reports/reports.module");
const settings_module_1 = require("./settings/settings.module");
const purchases_module_1 = require("./purchases/purchases.module");
const users_module_1 = require("./users/users.module");
const brands_module_1 = require("./brands/brands.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const expenses_module_1 = require("./expenses/expenses.module");
const expense_categories_module_1 = require("./expense-categories/expense-categories.module");
const fiscal_years_module_1 = require("./fiscal-years/fiscal-years.module");
const incomes_module_1 = require("./incomes/incomes.module");
const income_categories_module_1 = require("./income-categories/income-categories.module");
const companies_module_1 = require("./companies/companies.module");
const accounting_module_1 = require("./accounting/accounting.module");
const crm_module_1 = require("./crm/crm.module");
const ai_module_1 = require("./ai/ai.module");
const payments_module_1 = require("./payments/payments.module");
const sales_returns_module_1 = require("./sales-returns/sales-returns.module");
const purchase_returns_module_1 = require("./purchase-returns/purchase-returns.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            sales_module_1.SalesModule,
            customers_module_1.CustomersModule,
            reports_module_1.ReportsModule,
            settings_module_1.SettingsModule,
            purchases_module_1.PurchasesModule,
            users_module_1.UsersModule,
            brands_module_1.BrandsModule,
            suppliers_module_1.SuppliersModule,
            expenses_module_1.ExpensesModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            fiscal_years_module_1.FiscalYearsModule,
            incomes_module_1.IncomesModule,
            income_categories_module_1.IncomeCategoriesModule,
            companies_module_1.CompaniesModule,
            accounting_module_1.AccountingModule,
            crm_module_1.CrmModule,
            ai_module_1.AiModule,
            payments_module_1.PaymentsModule,
            sales_returns_module_1.SalesReturnsModule,
            purchase_returns_module_1.PurchaseReturnsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map