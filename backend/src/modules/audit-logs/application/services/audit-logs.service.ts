import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: { cursor?: string; take?: number }): Promise<{ data: AuditLogEntity[], nextCursor: string | null }> {
    const { cursor, take } = options;
    const limit = take || 10;

    const logs = await this.prisma.auditLog.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    let nextCursor: string | null = null;
    if (logs.length > limit) {
      const nextItem = logs.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: logs.map(l => ({
        id: l.id,
        entity_name: l.entity_name,
        entity_id: l.entity_id,
        action: l.action,
        old_data: l.old_data,
        new_data: l.new_data,
        user_id: l.user_id,
        user: l.user,
        created_at: l.created_at
      })),
      nextCursor,
    };
  }
}
