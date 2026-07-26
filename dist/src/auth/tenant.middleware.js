"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantMiddleware = class TenantMiddleware {
    use(req, res, next) {
        let companyId;
        let isSuperAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString();
                const payload = JSON.parse(payloadStr);
                if (payload && payload.companyId) {
                    companyId = payload.companyId;
                }
                if (payload && (payload.role === 'Super Admin' || payload.roleName === 'Super Admin')) {
                    isSuperAdmin = true;
                }
            }
            catch (err) {
            }
        }
        if (companyId) {
            prisma_service_1.tenantContext.run({ companyId, isSuperAdmin }, () => {
                next();
            });
        }
        else {
            next();
        }
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map