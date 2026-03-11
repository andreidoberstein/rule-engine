import { RuleTemplateEntity } from '../entities/rule-template.entity';
export interface IRuleTemplatesRepository {
    create(data: Omit<RuleTemplateEntity, 'id' | 'created_at' | 'updated_at'>): Promise<RuleTemplateEntity>;
    findAll(options: {
        cursor?: string;
        take?: number;
    }): Promise<{
        data: RuleTemplateEntity[];
        nextCursor: string | null;
    }>;
    findById(id: string): Promise<RuleTemplateEntity | null>;
    evaluateRules(clientId?: string, stateUf?: string): Promise<RuleTemplateEntity[]>;
    update(id: string, data: Partial<RuleTemplateEntity>): Promise<RuleTemplateEntity>;
    delete(id: string): Promise<void>;
}
