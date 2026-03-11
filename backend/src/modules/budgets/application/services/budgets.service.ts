import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IBudgetsRepository } from '../../domain/interfaces/budgets.repository.interface';
import { CreateBudgetDto, SimulateBudgetDto } from '../dtos/create-budget.dto';
import { UpdateBudgetDto } from '../dtos/update-budget.dto';
import { BudgetEntity } from '../../domain/entities/budget.entity';
import { RuleTemplatesService } from '../../../../modules/rule-templates/application/services/rule-templates.service';

@Injectable()
export class BudgetsService {
  constructor(
    @Inject('IBudgetsRepository')
    private readonly budgetsRepository: IBudgetsRepository,
    private readonly ruleTemplatesService: RuleTemplatesService,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<BudgetEntity> {
    return this.budgetsRepository.create(createBudgetDto);
  }

  async findAll(cursor?: string, take?: number): Promise<{ data: BudgetEntity[], nextCursor: string | null }> {
    return this.budgetsRepository.findAll({ cursor, take });
  }

  async findOne(id: string): Promise<BudgetEntity> {
    const budget = await this.budgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto): Promise<BudgetEntity> {
    const budget = await this.budgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return this.budgetsRepository.update(id, updateBudgetDto);
  }

  async remove(id: string): Promise<void> {
    const budget = await this.budgetsRepository.findById(id);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return this.budgetsRepository.delete(id);
  }

  async getVerbaTypes(): Promise<any[]> {
    return this.budgetsRepository.getVerbaTypes();
  }

  async getReferenceData(): Promise<any> {
    return this.budgetsRepository.getReferenceData();
  }

  async simulate(simulateDto: SimulateBudgetDto): Promise<any> {
    const results: any[] = [];

    for (const role of simulateDto.roles) {
      const rules = await this.ruleTemplatesService.evaluateRules(simulateDto.client_id, role.state_uf);
      
      const verbasCalculated = rules.map(rule => {
        let calculatedValue = 0;
        
        if (rule.calc_type === 'FIXED') {
          calculatedValue = rule.value * role.headcount;
        } else if (rule.calc_type === 'PERCENTAGE_BASE' || rule.calc_type === 'PERCENTAGE_TOTAL') {
          calculatedValue = rule.value; 
        }

        return {
          verba_type_id: rule.verba_type_id,
          verba_name: (rule as any).verba_type?.name,
          base_calc_type: rule.calc_type,
          base_value: rule.value,
          calc_type: rule.calc_type,
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
}
