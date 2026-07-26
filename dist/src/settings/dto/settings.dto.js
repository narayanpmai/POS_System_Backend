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
exports.UpdateSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSettingsDto {
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Antigravity Hyper POS', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100 Galaxy Way, Suite 2026', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1 (555) 767-2026', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sales@antigravitypos.com', required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VAT-US-202605', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "taxNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '$', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "currencySymbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Welcome to Antigravity SmartPOS!', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "receiptHeader", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thank you! See you again soon!', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "receiptFooter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PTRM', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "invoicePrefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.0, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "taxRateDefault", void 0);
//# sourceMappingURL=settings.dto.js.map