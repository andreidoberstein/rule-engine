"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const rule_templates_service_1 = require("./application/services/rule-templates.service");
const rule_templates_controller_1 = require("./infrastructure/controllers/rule-templates.controller");
const prisma_rule_templates_repository_1 = require("./infrastructure/repositories/prisma-rule-templates.repository");
const prisma_module_1 = require("../../infrastructure/database/prisma/prisma.module");
let RuleTemplatesModule = class RuleTemplatesModule {
};
exports.RuleTemplatesModule = RuleTemplatesModule;
exports.RuleTemplatesModule = RuleTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [rule_templates_controller_1.RuleTemplatesController],
        providers: [
            rule_templates_service_1.RuleTemplatesService,
            {
                provide: 'IRuleTemplatesRepository',
                useClass: prisma_rule_templates_repository_1.PrismaRuleTemplatesRepository,
            },
        ],
        exports: [rule_templates_service_1.RuleTemplatesService],
    })
], RuleTemplatesModule);
//# sourceMappingURL=rule-templates.module.js.map