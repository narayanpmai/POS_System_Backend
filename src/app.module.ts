import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantMiddleware } from './auth/tenant.middleware';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { AllowedHostMiddleware } from './common/middlewares/allowed-host.middleware';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor';
import { ExcludePasswordInterceptor } from './common/interceptors/exclude-password.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { PurchasesModule } from './purchases/purchases.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpenseCategoriesModule } from './expense-categories/expense-categories.module';
import { FiscalYearsModule } from './fiscal-years/fiscal-years.module';
import { IncomesModule } from './incomes/incomes.module';
import { IncomeCategoriesModule } from './income-categories/income-categories.module';
import { CompaniesModule } from './companies/companies.module';
import { AccountingModule } from './accounting/accounting.module';
import { CrmModule } from './crm/crm.module';
import { AiModule } from './ai/ai.module';
import { PaymentsModule } from './payments/payments.module';
import { SalesReturnsModule } from './sales-returns/sales-returns.module';
import { PurchaseReturnsModule } from './purchase-returns/purchase-returns.module';
import { UnitConversionsModule } from './unit-conversions/unit-conversions.module';
import { ShiftsModule } from './shifts/shifts.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    CustomersModule,
    ReportsModule,
    SettingsModule,
    PurchasesModule,
    UsersModule,
    BrandsModule,
    SuppliersModule,
    ExpensesModule,
    ExpenseCategoriesModule,
    FiscalYearsModule,
    IncomesModule,
    IncomeCategoriesModule,
    CompaniesModule,
    AccountingModule,
    CrmModule,
    AiModule,
    PaymentsModule,
    SalesReturnsModule,
    PurchaseReturnsModule,
    UnitConversionsModule,
    ShiftsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SanitizeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludePasswordInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, AllowedHostMiddleware, TenantMiddleware)
      .forRoutes('*');
  }
}
