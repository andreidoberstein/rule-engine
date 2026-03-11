import { BudgetEntity } from '../entities/budget.entity';

export interface IBudgetsRepository {
  create(data: Omit<BudgetEntity, 'id' | 'created_at' | 'updated_at'>): Promise<BudgetEntity>;
  findAll(options: { cursor?: string; take?: number }): Promise<{ data: BudgetEntity[], nextCursor: string | null }>;
  findById(id: string): Promise<BudgetEntity | null>;
  update(id: string, data: Partial<BudgetEntity>, userId?: string): Promise<BudgetEntity>;
  delete(id: string, userId?: string): Promise<void>;
  getVerbaTypes(): Promise<any[]>;
  getReferenceData(): Promise<any>;
}
