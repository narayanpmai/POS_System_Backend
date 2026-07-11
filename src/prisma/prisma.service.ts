import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantContext } from '../tenant/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
    
    this.$use(async (params, next) => {
      const context = tenantContext.getStore();
      const tenantId = context?.tenantId;

      if (!tenantId || params.model === 'Tenant') {
        return next(params);
      }

      if (params.args === undefined) {
        params.args = {};
      }

      if (['findUnique', 'findFirst', 'findMany', 'count', 'update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
        params.args.where = { ...params.args.where, tenantId };
      } else if (['create', 'createMany'].includes(params.action)) {
        if (Array.isArray(params.args.data)) {
          params.args.data = params.args.data.map(d => ({ ...d, tenantId }));
        } else {
          params.args.data = { ...params.args.data, tenantId };
        }
      } else if (params.action === 'upsert') {
        params.args.where = { ...params.args.where, tenantId };
        params.args.create = { ...params.args.create, tenantId };
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
