import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

export const tenantContext = new AsyncLocalStorage<{ companyId: number }>();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    
    // Add old-style middleware for multitenancy to intercept all base queries
    this.$use(async (params, next) => {
      const store = tenantContext.getStore();
      const companyId = store?.companyId;
      
      if (!companyId || ['Role', 'Company'].includes(params.model as string)) {
        return next(params);
      }

      const readOperations = ['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'];
      const writeOperations = ['update', 'updateMany', 'delete', 'deleteMany'];
      
      if (params.action === 'findUnique' || params.action === 'findUniqueOrThrow' || params.action === 'delete') {
         // for simple setup, let it pass without modification if it relies on unique id
         return next(params);
      }

      if (!params.args) params.args = {};
      const isRelationalTenant = ['SaleItem', 'PurchaseItem', 'JournalEntryLine'].includes(params.model as string);

      if (readOperations.includes(params.action) || writeOperations.includes(params.action)) {
        if (params.model === 'SaleItem') {
          params.args.where = { ...params.args.where, sale: { ...params.args.where?.sale, companyId } };
        } else if (params.model === 'PurchaseItem') {
          params.args.where = { ...params.args.where, purchase: { ...params.args.where?.purchase, companyId } };
        } else if (params.model === 'JournalEntryLine') {
          params.args.where = { ...params.args.where, journalEntry: { ...params.args.where?.journalEntry, companyId } };
        } else {
          params.args.where = { ...params.args.where, companyId };
        }
      } else if (!isRelationalTenant && (params.action === 'create' || params.action === 'createMany')) {
        if (Array.isArray(params.args.data)) {
          params.args.data = params.args.data.map((d: any) => ({ ...d, companyId }));
        } else {
          params.args.data = { ...params.args.data, companyId };
        }
      } else if (!isRelationalTenant && params.action === 'upsert') {
        params.args.where = { ...params.args.where, companyId };
        if (params.args.create) {
          params.args.create = { ...params.args.create, companyId };
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
