import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IRuleTemplatesRepository } from '../../domain/interfaces/rule-templates.repository.interface';
import { RuleTemplateEntity } from '../../domain/entities/rule-template.entity';
export declare class PrismaRuleTemplatesRepository implements IRuleTemplatesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private mapToEntity;
}
