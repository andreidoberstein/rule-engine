import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IRuleTemplatesRepository } from '../../domain/interfaces/rule-templates.repository.interface';
import { CreateRuleTemplateDto } from '../dtos/create-rule-template.dto';
import { UpdateRuleTemplateDto } from '../dtos/update-rule-template.dto';
import { RuleTemplateEntity } from '../../domain/entities/rule-template.entity';

@Injectable()
export class RuleTemplatesService {
  constructor(
    @Inject('IRuleTemplatesRepository')
    private readonly ruleTemplatesRepository: IRuleTemplatesRepository,
  ) {}

  async create(createDto: CreateRuleTemplateDto): Promise<RuleTemplateEntity> {
    return this.ruleTemplatesRepository.create(createDto);
  }

  async findAll(cursor?: string, take?: number): Promise<{ data: RuleTemplateEntity[], nextCursor: string | null }> {
    return this.ruleTemplatesRepository.findAll({ cursor, take });
  }

  async findOne(id: string): Promise<RuleTemplateEntity> {
    const rule = await this.ruleTemplatesRepository.findById(id);
    if (!rule) {
      throw new NotFoundException(`Rule Template with ID ${id} not found`);
    }
    return rule;
  }

  async evaluateRules(clientId?: string, stateUf?: string): Promise<RuleTemplateEntity[]> {
    return this.ruleTemplatesRepository.evaluateRules(clientId, stateUf);
  }

  async update(id: string, updateDto: UpdateRuleTemplateDto): Promise<RuleTemplateEntity> {
    const rule = await this.ruleTemplatesRepository.findById(id);
    if (!rule) {
      throw new NotFoundException(`Rule Template with ID ${id} not found`);
    }
    return this.ruleTemplatesRepository.update(id, updateDto);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.ruleTemplatesRepository.findById(id);
    if (!rule) {
      throw new NotFoundException(`Rule Template with ID ${id} not found`);
    }
    return this.ruleTemplatesRepository.delete(id);
  }
}
