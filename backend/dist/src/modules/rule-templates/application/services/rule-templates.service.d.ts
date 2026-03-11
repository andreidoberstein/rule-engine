import type { IRuleTemplatesRepository } from '../../domain/interfaces/rule-templates.repository.interface';
import { CreateRuleTemplateDto } from '../dtos/create-rule-template.dto';
import { UpdateRuleTemplateDto } from '../dtos/update-rule-template.dto';
import { RuleTemplateEntity } from '../../domain/entities/rule-template.entity';
export declare class RuleTemplatesService {
    private readonly ruleTemplatesRepository;
    constructor(ruleTemplatesRepository: IRuleTemplatesRepository);
    create(createDto: CreateRuleTemplateDto): Promise<RuleTemplateEntity>;
    findAll(cursor?: string, take?: number): Promise<{
        data: RuleTemplateEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<RuleTemplateEntity>;
    evaluateRules(clientId?: string, stateUf?: string): Promise<RuleTemplateEntity[]>;
    update(id: string, updateDto: UpdateRuleTemplateDto): Promise<RuleTemplateEntity>;
    remove(id: string): Promise<void>;
}
