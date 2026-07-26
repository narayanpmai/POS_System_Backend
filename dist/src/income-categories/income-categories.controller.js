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
exports.IncomeCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const income_categories_service_1 = require("./income-categories.service");
const income_categories_dto_1 = require("./dto/income-categories.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const swagger_1 = require("@nestjs/swagger");
let IncomeCategoriesController = class IncomeCategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(req, dto) {
        return this.categoriesService.create(req.user.companyId, dto);
    }
    findAll(req, search) {
        return this.categoriesService.findAll(req.user.companyId, search);
    }
    findOne(req, id) {
        return this.categoriesService.findOne(req.user.companyId, id);
    }
    update(req, id, dto) {
        return this.categoriesService.update(req.user.companyId, id, dto);
    }
    remove(req, id) {
        return this.categoriesService.remove(req.user.companyId, id);
    }
};
exports.IncomeCategoriesController = IncomeCategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new income category' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, income_categories_dto_1.CreateIncomeCategoryDto]),
    __metadata("design:returntype", void 0)
], IncomeCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all income categories' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], IncomeCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific income category' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], IncomeCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update income category details' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, income_categories_dto_1.UpdateIncomeCategoryDto]),
    __metadata("design:returntype", void 0)
], IncomeCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete income category' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], IncomeCategoriesController.prototype, "remove", null);
exports.IncomeCategoriesController = IncomeCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Income Categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('income-categories'),
    __metadata("design:paramtypes", [income_categories_service_1.IncomeCategoriesService])
], IncomeCategoriesController);
//# sourceMappingURL=income-categories.controller.js.map