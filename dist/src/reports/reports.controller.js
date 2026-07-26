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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboardSummary(req, queryCompanyId) {
        const cid = (req.user.role.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
        return this.reportsService.getDashboardSummary(cid);
    }
    getSalesAnalytics(req, startDate, endDate, queryCompanyId) {
        const cid = (req.user.role.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
        return this.reportsService.getSalesAnalytics(cid, startDate, endDate);
    }
    getInventoryReport(req) {
        return this.reportsService.getInventoryReport(req.user.companyId);
    }
    getFinancialReport(req) {
        return this.reportsService.getFinancialReport(req.user.companyId);
    }
    getDailySummary(req, startDate, endDate) {
        return this.reportsService.getDailySummary(req.user.companyId, startDate, endDate);
    }
    getClosingStock(req) {
        return this.reportsService.getClosingStock(req.user.companyId);
    }
    getClosingBalance(req) {
        return this.reportsService.getClosingBalance(req.user.companyId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve full KPI dashboard widgets dataset' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, roles_decorator_1.Roles)('Admin', 'Super Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch date-ranged historical sales graphs and timelines' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSalesAnalytics", null);
__decorate([
    (0, common_1.Get)('inventory-valuation'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate total asset cost valuation and stock thresholds (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Comprehensive financial breakdown by Nepali Fiscal Year (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancialReport", null);
__decorate([
    (0, common_1.Get)('daily-summary'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Daily report summary with telemetry widgets and daily timelines (Admin Only)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)('closing-stock'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate Closing Stock for Active Fiscal Year' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getClosingStock", null);
__decorate([
    (0, common_1.Get)('closing-balance'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate Closing Balance for Active Fiscal Year' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getClosingBalance", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reporting & Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map