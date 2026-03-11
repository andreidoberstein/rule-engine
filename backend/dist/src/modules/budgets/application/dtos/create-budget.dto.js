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
exports.SimulateBudgetDto = exports.CreateBudgetDto = exports.BudgetRoleDto = exports.BudgetVerbaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BudgetVerbaDto {
    verba_type_id;
    value;
    calc_type;
}
exports.BudgetVerbaDto = BudgetVerbaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BudgetVerbaDto.prototype, "verba_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BudgetVerbaDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BudgetVerbaDto.prototype, "calc_type", void 0);
class BudgetRoleDto {
    role_id;
    state_uf;
    headcount;
    verbas;
}
exports.BudgetRoleDto = BudgetRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BudgetRoleDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BudgetRoleDto.prototype, "state_uf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BudgetRoleDto.prototype, "headcount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BudgetVerbaDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BudgetVerbaDto),
    __metadata("design:type", Array)
], BudgetRoleDto.prototype, "verbas", void 0);
class CreateBudgetDto {
    client_id;
    status;
    dates;
    total;
    roles;
}
exports.CreateBudgetDto = CreateBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Client ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DRAFT', description: 'Budget status' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024 - 2025', description: 'Budget valid dates' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "dates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000.00, description: 'Total value of the budget' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BudgetRoleDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BudgetRoleDto),
    __metadata("design:type", Array)
], CreateBudgetDto.prototype, "roles", void 0);
class SimulateBudgetDto {
    client_id;
    roles;
}
exports.SimulateBudgetDto = SimulateBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SimulateBudgetDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SimulateBudgetDto.prototype, "roles", void 0);
//# sourceMappingURL=create-budget.dto.js.map