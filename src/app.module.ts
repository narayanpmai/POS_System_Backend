import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
