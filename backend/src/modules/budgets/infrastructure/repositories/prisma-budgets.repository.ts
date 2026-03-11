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
        user_id: data.user_id,
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
      } as any,
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
      where: { is_active: true } as any,
      orderBy: { created_at: 'desc' },
      include: { 
        client: true,
        created_by: {
          select: { name: true }
        }
      } as any,
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
      include: { 
        client: true,
        roles: {
          include: {
            role: true,
            verbas: {
              include: {
                verba_type: true
              }
            }
          }
        }
      },
    });
    return budget ? this.mapToEntity(budget) : null;
  }

  async update(id: string, data: Partial<BudgetEntity>, userId?: string): Promise<BudgetEntity> {
    const { client, roles, ...updateData } = data as any;
    
    // Always fetch full old structure so AuditLog captures it completely
    const oldBudget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            verbas: true
          }
        }
      }
    });

    if (roles && roles.length > 0) {
      // 1. Delete all existing verbas first to prevent FK constraints
      const oldRoles = await this.prisma.budgetRole.findMany({
        where: { budget_id: id },
        select: { id: true }
      });
      
      if (oldRoles.length > 0) {
        await this.prisma.budgetVerba.deleteMany({
          where: { budget_role_id: { in: oldRoles.map(r => r.id) } }
        });
        
        await this.prisma.budgetRole.deleteMany({
          where: { budget_id: id }
        });
      }

      // 2. We inject the new roles payload back into updateData utilizing Prisma nested create syntax
      updateData.roles = {
        create: roles.map((r: any) => ({
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
        }))
      };
    }

    const budget = await this.prisma.budget.update({
      where: { id },
      data: updateData,
      include: { 
        client: true,
        roles: {
          include: {
            verbas: true
          }
        }
      },
    });

    if (userId && oldBudget) {
      await this.prisma.auditLog.create({
        data: {
          entity_name: 'Budget',
          entity_id: id,
          action: 'UPDATE',
          old_data: oldBudget as any,
          new_data: budget as any,
          user_id: userId,
        }
      });
    }

    return this.mapToEntity(budget);
  }

  async delete(id: string, userId?: string): Promise<void> {
    const oldBudget = await this.prisma.budget.findUnique({ where: { id } });

    await this.prisma.budget.update({ 
      where: { id }, 
      data: { is_active: false } as any
    });

    if (userId && oldBudget) {
      await this.prisma.auditLog.create({
        data: {
          entity_name: 'Budget',
          entity_id: id,
          action: 'DELETE',
          old_data: oldBudget as any,
          user_id: userId,
        }
      });
    }
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
      client: prismaBudget.client,
      roles: prismaBudget.roles,
      created_by: prismaBudget.created_by,
      created_at: prismaBudget.created_at,
      updated_at: prismaBudget.updated_at,
    };
  }
}
