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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const sales_dto_1 = require("./dto/sales.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const swagger_1 = require("@nestjs/swagger");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    checkout(dto, req) {
        const cashierId = req.user.id;
        return this.salesService.checkout(req.user.companyId, dto, cashierId);
    }
    findAllSales(req, page, limit, search, startDate, endDate, categoryId) {
        return this.salesService.findAllSales(req.user.companyId, { page, limit, search, startDate, endDate, categoryId });
    }
    getDeletedSales(req) {
        if (req.user.role.name !== 'Admin') {
            throw new Error('Unauthorized');
        }
        return this.salesService.getDeletedSales(req.user.companyId);
    }
    findSaleById(req, id) {
        return this.salesService.findSaleById(req.user.companyId, id);
    }
    clearAllSales(req) {
        if (req.user.role.name !== 'Admin') {
            throw new Error('Unauthorized');
        }
        return this.salesService.clearAllSales(req.user.companyId);
    }
    remove(id, req) {
        if (req.user.role.name !== 'Admin') {
            throw new Error('Unauthorized');
        }
        return this.salesService.remove(req.user.companyId, id, req.user.id);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Process a new POS transaction checkout' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sale processed successfully, returns transaction details' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sales_dto_1.CreateSaleDto, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List sales transactions with date and keyword filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Format YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Format YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAllSales", null);
__decorate([
    (0, common_1.Get)('deleted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all deleted sales log (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getDeletedSales", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific sale transaction for invoice/receipt' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findSaleById", null);
__decorate([
    (0, common_1.Delete)('clear-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all sales data (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "clearAllSales", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a sale transaction and revert stock (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "remove", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('POS Transactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map