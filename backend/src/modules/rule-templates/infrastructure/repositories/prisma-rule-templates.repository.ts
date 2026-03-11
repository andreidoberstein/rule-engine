import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IRuleTemplatesRepository } from '../../domain/interfaces/rule-templates.repository.interface';
import { RuleTemplateEntity } from '../../domain/entities/rule-template.entity';

@Injectable()
export class PrismaRuleTemplatesRepository implements IRuleTemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<RuleTemplateEntity, 'id' | 'created_at' | 'updated_at'>): Promise<RuleTemplateEntity> {
    const rule = await this.prisma.ruleTemplate.create({
      data: {
        client_id: data.client_id,
        state_uf: data.state_uf,
        verba_type_id: data.verba_type_id,
        calc_type: data.calc_type,
        value: data.value,
        text_value: data.text_value,
      },
      include: { verba_type: true },
    });
    
    return this.mapToEntity(rule);
  }

  async findAll(options: { cursor?: string; take?: number }): Promise<{ data: RuleTemplateEntity[], nextCursor: string | null }> {
    const { cursor, take } = options;
    const limit = take || 10;

    const rules = await this.prisma.ruleTemplate.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { created_at: 'desc' },
      include: { verba_type: true, client: true },
    });

    let nextCursor: string | null = null;
    if (rules.length > limit) {
      const nextItem = rules.pop();
      nextCursor = nextItem?.id || null;
    }

    return {
      data: rules.map(this.mapToEntity),
      nextCursor,
    };
  }

  async findById(id: string): Promise<RuleTemplateEntity | null> {
    const rule = await this.prisma.ruleTemplate.findUnique({
      where: { id },
      include: { verba_type: true, client: true },
    });
    return rule ? this.mapToEntity(rule) : null;
  }

  async evaluateRules(clientId?: string, stateUf?: string): Promise<RuleTemplateEntity[]> {
    const applicableRules = await this.prisma.ruleTemplate.findMany({
      where: {
        OR: [
          { client_id: clientId || null, state_uf: stateUf || null },
          { client_id: clientId || null, state_uf: null },
          { client_id: null, state_uf: stateUf || null },
          { client_id: null, state_uf: null }
        ]
      },
      include: { verba_type: true }
    });

    // 2. We resolve conflicts by keeping the most specific rule for each verba_type
    // Priority Score:
    // Client + State = 3
    // Client Only    = 2
    // State Only     = 1
    // Global         = 0
    
    const rulesMap = new Map<string, any>();

    applicableRules.forEach((rule) => {
      let score = 0;
      if (rule.client_id) score += 2;
      if (rule.state_uf) score += 1;

      const existingRule = rulesMap.get(rule.verba_type_id);
      if (!existingRule || existingRule.score < score) {
        rulesMap.set(rule.verba_type_id, { rule, score });
      }
    });

    return Array.from(rulesMap.values()).map(r => this.mapToEntity(r.rule));
  }

  async update(id: string, data: Partial<RuleTemplateEntity>): Promise<RuleTemplateEntity> {
    const rule = await this.prisma.ruleTemplate.update({
      where: { id },
      data: {
        client_id: data.client_id !== undefined ? data.client_id : undefined,
        state_uf: data.state_uf !== undefined ? data.state_uf : undefined,
        verba_type_id: data.verba_type_id !== undefined ? data.verba_type_id : undefined,
        calc_type: data.calc_type !== undefined ? data.calc_type : undefined,
        value: data.value !== undefined ? data.value : undefined,
        text_value: data.text_value !== undefined ? data.text_value : undefined,
      },
      include: { verba_type: true, client: true },
    });
    return this.mapToEntity(rule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ruleTemplate.delete({ where: { id } });
  }

  private mapToEntity(prismaRule: any): RuleTemplateEntity {
    return {
      id: prismaRule.id,
      client_id: prismaRule.client_id,
      state_uf: prismaRule.state_uf,
      verba_type_id: prismaRule.verba_type_id,
      calc_type: prismaRule.calc_type,
      value: Number(prismaRule.value),
      text_value: prismaRule.text_value,
      created_at: prismaRule.created_at,
      updated_at: prismaRule.updated_at,
    };
  }
}
