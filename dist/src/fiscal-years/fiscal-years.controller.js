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
exports.FiscalYearsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fiscal_years_service_1 = require("./fiscal-years.service");
const fiscal_year_dto_1 = require("./dto/fiscal-year.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let FiscalYearsController = class FiscalYearsController {
    constructor(fiscalYearsService) {
        this.fiscalYearsService = fiscalYearsService;
    }
    findAll(req) {
        return this.fiscalYearsService.findAll(req.user.companyId);
    }
    findActive(req) {
        return this.fiscalYearsService.findActive(req.user.companyId);
    }
    create(req, createDto) {
        return this.fiscalYearsService.create(req.user.companyId, createDto);
    }
    update(req, id, updateDto) {
        return this.fiscalYearsService.update(req.user.companyId, id, updateDto);
    }
    setActive(req, id) {
        return this.fiscalYearsService.setActive(req.user.companyId, id);
    }
    delete(req, id) {
        return this.fiscalYearsService.delete(req.user.companyId, id);
    }
};
exports.FiscalYearsController = FiscalYearsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fiscal years' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get currently active fiscal year' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fiscal year (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fiscal_year_dto_1.CreateFiscalYearDto]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a fiscal year (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, fiscal_year_dto_1.UpdateFiscalYearDto]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/set-active'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Set a fiscal year as active (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "setActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a fiscal year (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FiscalYearsController.prototype, "delete", null);
exports.FiscalYearsController = FiscalYearsController = __decorate([
    (0, swagger_1.ApiTags)('Fiscal Years'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('fiscal-years'),
    __metadata("design:paramtypes", [fiscal_years_service_1.FiscalYearsService])
], FiscalYearsController);
//# sourceMappingURL=fiscal-years.controller.js.map