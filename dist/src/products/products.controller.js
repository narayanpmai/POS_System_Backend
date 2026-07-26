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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_dto_1 = require("./dto/products.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    createCategory(req, dto) {
        return this.productsService.createCategory(req.user.companyId, dto);
    }
    findAllCategories(req, queryCompanyId) {
        const cid = (req.user.role?.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
        return this.productsService.findAllCategories(cid);
    }
    findCategoryById(req, id) {
        return this.productsService.findCategoryById(req.user.companyId, id);
    }
    updateCategory(req, id, dto) {
        return this.productsService.updateCategory(req.user.companyId, id, dto);
    }
    removeCategory(req, id) {
        return this.productsService.removeCategory(req.user.companyId, id);
    }
    createProduct(dto, req) {
        const userId = req.user.id;
        return this.productsService.createProduct(req.user.companyId, dto, userId);
    }
    findAllProducts(req, page, limit, search, categoryId, lowStockOnly, queryCompanyId) {
        const cid = (req.user.role?.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
        return this.productsService.findAllProducts(cid, { page, limit, search, categoryId, lowStockOnly });
    }
    findProductByBarcode(req, barcode) {
        return this.productsService.findProductByBarcode(req.user.companyId, barcode);
    }
    findProductById(req, id) {
        return this.productsService.findProductById(req.user.companyId, id);
    }
    updateProduct(req, id, dto) {
        return this.productsService.updateProduct(req.user.companyId, id, dto);
    }
    removeProduct(req, id) {
        return this.productsService.removeProduct(req.user.companyId, id);
    }
    updateStockManually(id, quantity, type, reason, req) {
        const userId = req.user.id;
        return this.productsService.updateStockManually(req.user.companyId, id, quantity, type, reason, userId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new product category (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, products_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'List all product categories' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category details' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findCategoryById", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, products_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete category (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new product (Admin Only)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search and list products with filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lowStockOnly', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('categoryId')),
    __param(5, (0, common_1.Query)('lowStockOnly')),
    __param(6, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, Number, Boolean, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, common_1.Get)('barcode/:barcode'),
    (0, swagger_1.ApiOperation)({ summary: 'Find product by barcode scanner value' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findProductByBarcode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product details' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findProductById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product properties (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, products_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product (Admin Only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeProduct", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Manual stock adjust - stock in / stock out (Admin Only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('quantity', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Body)('reason')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateStockManually", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products & Catalog'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map