"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalIntPipe = void 0;
const common_1 = require("@nestjs/common");
let OptionalIntPipe = class OptionalIntPipe {
    transform(value, metadata) {
        if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null' || (typeof value === 'number' && isNaN(value))) {
            return undefined;
        }
        if (typeof value === 'object') {
            return undefined;
        }
        const val = typeof value === 'number' ? value : parseInt(value, 10);
        if (isNaN(val)) {
            throw new common_1.BadRequestException(`${metadata.data} must be a number`);
        }
        return val;
    }
};
exports.OptionalIntPipe = OptionalIntPipe;
exports.OptionalIntPipe = OptionalIntPipe = __decorate([
    (0, common_1.Injectable)()
], OptionalIntPipe);
//# sourceMappingURL=optional-int.pipe.js.map