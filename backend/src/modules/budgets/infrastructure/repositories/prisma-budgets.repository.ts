import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IBudgetsRepository } from '../../domain/interfaces/budgets.repository.interface';
import { BudgetEntity } from '../../domain/entities/budget.entity';

@Injectable()
export class PrismaBudgetsRepository implements IBudgetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<BudgetEntity> {
    const budget = await this.prisma.budget.create({
      data: {
        client_id: data.client_id,
        status: data.status,
        dates: data.dates,
        total: data.total,
        roles: {
          create: data.roles?.map((r: any) => ({
            role_id: r.role_id,
            state_uf: r.state_uf,
            headcount: r.headcount,
            verbas: {
              create: r.verbas?.map((v: any) => ({
                verba_type_id: v.verba_type_id,
                base_calc_type: v.base_calc_type || 'FIXED',
                base_value: v.base_value || 0.0,
                calc_type: v.calc_type || 'FIXED',
                value: v.value || 0.0,
              })) || []
            }
          })) || []
        }
      },
      include: { client: true },
    });
    return this.mapToEntity(budget);
  }

  async findAll(options: { cursor?: string; take?: number }): Promise<{ data: BudgetEntity[], nextCursor: string | null }> {
    const { cursor, take } = options;
    const limit = take || 5;

    const budgets = await this.prisma.budget.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { created_at: 'desc' },
      include: { client: true },
    });

    let nextCursor: string | null = null;
    if (budgets.length > limit) {
      const nextItem = budgets.pop();
      nextCursor = nextItem?.id || null;
    }

    return {
      data: budgets.map(this.mapToEntity),
      nextCursor,
    };
  }

  async findById(id: string): Promise<BudgetEntity | null> {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: { client: true },
    });
    return budget ? this.mapToEntity(budget) : null;
  }

  async update(id: string, data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const budget = await this.prisma.budget.update({
      where: { id },
      data,
      include: { client: true },
    });
    return this.mapToEntity(budget);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({ where: { id } });
  }

  async getVerbaTypes(): Promise<any[]> {
    return this.prisma.verbaType.findMany({
      orderBy: { group_id: 'asc' },
      include: { group: true }
    });
  }

  async getReferenceData(): Promise<any> {
    const areas = await this.prisma.area.findMany();
    const roles = await this.prisma.roleType.findMany();
    return { areas, roles };
  }

  private mapToEntity(prismaBudget: any): BudgetEntity {
    return {
      id: prismaBudget.id,
      client_id: prismaBudget.client_id,
      status: prismaBudget.status,
      dates: prismaBudget.dates,
      total: Number(prismaBudget.total),
      created_at: prismaBudget.created_at,
      updated_at: prismaBudget.updated_at,
    };
  }
}
