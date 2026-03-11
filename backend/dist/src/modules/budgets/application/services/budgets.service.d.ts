import type { IBudgetsRepository } from '../../domain/interfaces/budgets.repository.interface';
import { CreateBudgetDto, SimulateBudgetDto } from '../dtos/create-budget.dto';
import { UpdateBudgetDto } from '../dtos/update-budget.dto';
import { BudgetEntity } from '../../domain/entities/budget.entity';
import { RuleTemplatesService } from '../../../../modules/rule-templates/application/services/rule-templates.service';
export declare class BudgetsService {
    private readonly budgetsRepository;
    private readonly ruleTemplatesService;
    constructor(budgetsRepository: IBudgetsRepository, ruleTemplatesService: RuleTemplatesService);
    create(createBudgetDto: CreateBudgetDto): Promise<BudgetEntity>;
    findAll(cursor?: string, take?: number): Promise<{
        data: BudgetEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<BudgetEntity>;
    update(id: string, updateBudgetDto: UpdateBudgetDto): Promise<BudgetEntity>;
    remove(id: string): Promise<void>;
    getVerbaTypes(): Promise<any[]>;
    getReferenceData(): Promise<any>;
    simulate(simulateDto: SimulateBudgetDto): Promise<any>;
}
