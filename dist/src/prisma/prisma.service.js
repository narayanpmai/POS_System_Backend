"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = exports.tenantContext = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const async_hooks_1 = require("async_hooks");
exports.tenantContext = new async_hooks_1.AsyncLocalStorage();
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        this.$use(async (params, next) => {
            const store = exports.tenantContext.getStore();
            const companyId = store?.companyId;
            const isSuperAdmin = store?.isSuperAdmin;
            if (!companyId || ['Role', 'Company'].includes(params.model)) {
                return next(params);
            }
            if (isSuperAdmin) {
                if (!params.args)
                    params.args = {};
                const isRelationalTenant = ['SaleItem', 'PurchaseItem', 'JournalEntryLine'].includes(params.model);
                if (!isRelationalTenant && (params.action === 'create' || params.action === 'createMany')) {
                    if (Array.isArray(params.args.data)) {
                        params.args.data = params.args.data.map((d) => ({ companyId: d.companyId || companyId, ...d }));
                    }
                    else {
                        params.args.data = { companyId: params.args.data?.companyId || companyId, ...params.args.data };
                    }
                }
                else if (!isRelationalTenant && params.action === 'upsert') {
                    if (params.args.create) {
                        params.args.create = { companyId: params.args.create?.companyId || companyId, ...params.args.create };
                    }
                }
                return next(params);
            }
            const readOperations = ['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'];
            const writeOperations = ['update', 'updateMany', 'delete', 'deleteMany'];
            if (params.action === 'findUnique' || params.action === 'findUniqueOrThrow' || params.action === 'delete') {
                return next(params);
            }
            if (!params.args)
                params.args = {};
            const isRelationalTenant = ['SaleItem', 'PurchaseItem', 'JournalEntryLine'].includes(params.model);
            if (readOperations.includes(params.action) || writeOperations.includes(params.action)) {
                if (params.model === 'SaleItem') {
                    params.args.where = { ...params.args.where, sale: { ...params.args.where?.sale, companyId } };
                }
                else if (params.model === 'PurchaseItem') {
                    params.args.where = { ...params.args.where, purchase: { ...params.args.where?.purchase, companyId } };
                }
                else if (params.model === 'JournalEntryLine') {
                    params.args.where = { ...params.args.where, journalEntry: { ...params.args.where?.journalEntry, companyId } };
                }
                else {
                    params.args.where = { ...params.args.where, companyId };
                }
            }
            else if (!isRelationalTenant && (params.action === 'create' || params.action === 'createMany')) {
                if (Array.isArray(params.args.data)) {
                    params.args.data = params.args.data.map((d) => ({ ...d, companyId }));
                }
                else {
                    params.args.data = { ...params.args.data, companyId };
                }
            }
            else if (!isRelationalTenant && params.action === 'upsert') {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map