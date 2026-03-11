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
exports.CreateRuleTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRuleTemplateDto {
    client_id;
    state_uf;
    verba_type_id;
    calc_type;
    value;
    text_value;
}
exports.CreateRuleTemplateDto = CreateRuleTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid', description: 'Client ID - null means global rule' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRuleTemplateDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SP', description: 'State UF - null means global state' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRuleTemplateDto.prototype, "state_uf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Relation to Verba Type' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRuleTemplateDto.prototype, "verba_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FIXED', description: 'Calculation type: FIXED, PERCENTAGE_BASE, PERCENTAGE_TOTAL...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRuleTemplateDto.prototype, "calc_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200.50, description: 'Numeric value of rule if applicable' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateRuleTemplateDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Custom Text', description: 'Text value if CalcType is TEXT' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRuleTemplateDto.prototype, "text_value", void 0);
//# sourceMappingURL=create-rule-template.dto.js.map