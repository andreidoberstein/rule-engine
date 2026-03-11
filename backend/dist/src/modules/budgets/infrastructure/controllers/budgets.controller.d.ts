import { BudgetsService } from '../../application/services/budgets.service';
import { CreateBudgetDto, SimulateBudgetDto } from '../../application/dtos/create-budget.dto';
import { UpdateBudgetDto } from '../../application/dtos/update-budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    getVerbaTypes(): Promise<any[]>;
    getReferenceData(): Promise<any>;
    simulate(simulateBudgetDto: SimulateBudgetDto): Promise<any>;
    create(createBudgetDto: CreateBudgetDto): Promise<import("../../domain/entities/budget.entity").BudgetEntity>;
    findAll(cursor?: string, take?: string): Promise<{
        data: import("../../domain/entities/budget.entity").BudgetEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/budget.entity").BudgetEntity>;
    update(id: string, updateBudgetDto: UpdateBudgetDto): Promise<import("../../domain/entities/budget.entity").BudgetEntity>;
    remove(id: string): Promise<void>;
}
