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
exports.RuleTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rule_templates_service_1 = require("../../application/services/rule-templates.service");
const create_rule_template_dto_1 = require("../../application/dtos/create-rule-template.dto");
const update_rule_template_dto_1 = require("../../application/dtos/update-rule-template.dto");
let RuleTemplatesController = class RuleTemplatesController {
    ruleTemplatesService;
    constructor(ruleTemplatesService) {
        this.ruleTemplatesService = ruleTemplatesService;
    }
    create(createRuleTemplateDto) {
        return this.ruleTemplatesService.create(createRuleTemplateDto);
    }
    evaluateRules(clientId, stateUf) {
        return this.ruleTemplatesService.evaluateRules(clientId, stateUf);
    }
    findAll(cursor, take) {
        const takeNumber = take ? parseInt(take, 10) : undefined;
        return this.ruleTemplatesService.findAll(cursor, takeNumber);
    }
    findOne(id) {
        return this.ruleTemplatesService.findOne(id);
    }
    update(id, updateRuleTemplateDto) {
        return this.ruleTemplatesService.update(id, updateRuleTemplateDto);
    }
    remove(id) {
        return this.ruleTemplatesService.remove(id);
    }
};
exports.RuleTemplatesController = RuleTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new rule template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rule template created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rule_template_dto_1.CreateRuleTemplateDto]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate rules based on Client and State priority' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, type: String, description: 'Client ID parameter' }),
    (0, swagger_1.ApiQuery)({ name: 'stateUf', required: false, type: String, description: 'State UF parameter (e.g. SP, RJ)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of resolved winning rules for each Verba Type.' }),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('stateUf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "evaluateRules", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rules with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    __param(0, (0, common_1.Query)('cursor')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single rule template by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a rule template' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rule_template_dto_1.UpdateRuleTemplateDto]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a rule template' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuleTemplatesController.prototype, "remove", null);
exports.RuleTemplatesController = RuleTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Rule Templates (Motor de Regras)'),
    (0, common_1.Controller)('rule-templates'),
    __metadata("design:paramtypes", [rule_templates_service_1.RuleTemplatesService])
], RuleTemplatesController);
//# sourceMappingURL=rule-templates.controller.js.map