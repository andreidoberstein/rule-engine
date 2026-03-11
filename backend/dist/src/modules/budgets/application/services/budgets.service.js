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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const rule_templates_service_1 = require("../../../../modules/rule-templates/application/services/rule-templates.service");
let BudgetsService = class BudgetsService {
    budgetsRepository;
    ruleTemplatesService;
    constructor(budgetsRepository, ruleTemplatesService) {
        this.budgetsRepository = budgetsRepository;
        this.ruleTemplatesService = ruleTemplatesService;
    }
    async create(createBudgetDto) {
        return this.budgetsRepository.create(createBudgetDto);
    }
    async findAll(cursor, take) {
        return this.budgetsRepository.findAll({ cursor, take });
    }
    async findOne(id) {
        const budget = await this.budgetsRepository.findById(id);
        if (!budget) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        return budget;
    }
    async update(id, updateBudgetDto) {
        const budget = await this.budgetsRepository.findById(id);
        if (!budget) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        return this.budgetsRepository.update(id, updateBudgetDto);
    }
    async remove(id) {
        const budget = await this.budgetsRepository.findById(id);
        if (!budget) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        return this.budgetsRepository.delete(id);
    }
    async getVerbaTypes() {
        return this.budgetsRepository.getVerbaTypes();
    }
    async getReferenceData() {
        return this.budgetsRepository.getReferenceData();
    }
    async simulate(simulateDto) {
        const results = [];
        for (const role of simulateDto.roles) {
            const rules = await this.ruleTemplatesService.evaluateRules(simulateDto.client_id, role.state_uf);
            const verbasCalculated = rules.map(rule => {
                let calculatedValue = 0;
                if (rule.calc_type === 'FIXED') {
                    calculatedValue = rule.value * role.headcount;
                }
                else if (rule.calc_type === 'PERCENTAGE_BASE' || rule.calc_type === 'PERCENTAGE_TOTAL') {
                    calculatedValue = rule.value;
                }
                return {
                    verba_type_id: rule.verba_type_id,
                    verba_name: rule.verba_type?.name,
                    calc_type: rule.calc_type,
                    base_value: rule.value,
                    headcount: role.headcount,
                    total_calculated: calculatedValue
                };
            });
            results.push({
                role_id: role.role_id,
                state_uf: role.state_uf,
                headcount: role.headcount,
                verbas: verbasCalculated
            });
        }
        return results;
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IBudgetsRepository')),
    __metadata("design:paramtypes", [Object, rule_templates_service_1.RuleTemplatesService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map