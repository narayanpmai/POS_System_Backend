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
exports.AccountingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountingService = class AccountingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAccounts(companyId) {
        return this.prisma.account.findMany({
            where: { companyId },
            orderBy: { code: 'asc' },
        });
    }
    async createAccount(companyId, data) {
        return this.prisma.account.create({ data: { ...data, companyId } });
    }
    async getJournalEntries(companyId) {
        return this.prisma.journalEntry.findMany({
            where: { companyId },
            include: {
                lines: {
                    include: { account: true }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    async createJournalEntry(companyId, data) {
        const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
        const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error('Journal Entry must balance (Debits = Credits)');
        }
        return this.prisma.journalEntry.create({
            data: {
                description: data.description,
                referenceNo: data.referenceNo,
                companyId,
                lines: {
                    create: data.lines.map(line => ({
                        accountId: line.accountId,
                        debit: line.debit,
                        credit: line.credit,
                        description: line.description,
                    }))
                }
            }
        });
    }
    async getTrialBalance(companyId) {
        const accounts = await this.getAccounts(companyId);
        const balances = await Promise.all(accounts.map(async (acc) => {
            const lines = await this.prisma.journalEntryLine.findMany({
                where: { accountId: acc.id }
            });
            const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
            const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
            let balance = 0;
            if (acc.type === 'ASSET' || acc.type === 'EXPENSE') {
                balance = totalDebit - totalCredit;
            }
            else {
                balance = totalCredit - totalDebit;
            }
            return {
                ...acc,
                totalDebit,
                totalCredit,
                balance
            };
        }));
        return balances;
    }
};
exports.AccountingService = AccountingService;
exports.AccountingService = AccountingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountingService);
//# sourceMappingURL=accounting.service.js.map