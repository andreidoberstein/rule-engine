import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IBudgetsRepository } from '../../domain/interfaces/budgets.repository.interface';
import { BudgetEntity } from '../../domain/entities/budget.entity';
export declare class PrismaBudgetsRepository implements IBudgetsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<BudgetEntity>;
    findAll(options: {
        cursor?: string;
        take?: number;
    }): Promise<{
        data: BudgetEntity[];
        nextCursor: string | null;
    }>;
    findById(id: string): Promise<BudgetEntity | null>;
    update(id: string, data: Partial<BudgetEntity>): Promise<BudgetEntity>;
    delete(id: string): Promise<void>;
    getVerbaTypes(): Promise<any[]>;
    getReferenceData(): Promise<any>;
    private mapToEntity;
}
