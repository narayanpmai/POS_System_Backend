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
exports.PurchaseReturnsController = void 0;
const common_1 = require("@nestjs/common");
const purchase_returns_service_1 = require("./purchase-returns.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let PurchaseReturnsController = class PurchaseReturnsController {
    constructor(purchaseReturnsService) {
        this.purchaseReturnsService = purchaseReturnsService;
    }
    async create(req, data) {
        return this.purchaseReturnsService.create(req.user.companyId, req.user.id, data);
    }
    async findAll(req) {
        return this.purchaseReturnsService.findAll(req.user.companyId);
    }
    async findOne(req, id) {
        return this.purchaseReturnsService.findOne(req.user.companyId, +id);
    }
};
exports.PurchaseReturnsController = PurchaseReturnsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PurchaseReturnsController.prototype, "findOne", null);
exports.PurchaseReturnsController = PurchaseReturnsController = __decorate([
    (0, common_1.Controller)('purchase-returns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [purchase_returns_service_1.PurchaseReturnsService])
], PurchaseReturnsController);
//# sourceMappingURL=purchase-returns.controller.js.map