import { RuleTemplatesService } from '../../application/services/rule-templates.service';
import { CreateRuleTemplateDto } from '../../application/dtos/create-rule-template.dto';
import { UpdateRuleTemplateDto } from '../../application/dtos/update-rule-template.dto';
export declare class RuleTemplatesController {
    private readonly ruleTemplatesService;
    constructor(ruleTemplatesService: RuleTemplatesService);
    create(createRuleTemplateDto: CreateRuleTemplateDto): Promise<import("../../domain/entities/rule-template.entity").RuleTemplateEntity>;
    evaluateRules(clientId?: string, stateUf?: string): Promise<import("../../domain/entities/rule-template.entity").RuleTemplateEntity[]>;
    findAll(cursor?: string, take?: string): Promise<{
        data: import("../../domain/entities/rule-template.entity").RuleTemplateEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/rule-template.entity").RuleTemplateEntity>;
    update(id: string, updateRuleTemplateDto: UpdateRuleTemplateDto): Promise<import("../../domain/entities/rule-template.entity").RuleTemplateEntity>;
    remove(id: string): Promise<void>;
}
