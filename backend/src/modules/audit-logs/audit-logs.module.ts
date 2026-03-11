import { Module } from '@nestjs/common';
import { AuditLogsController } from './infrastructure/controllers/audit-logs.controller';
import { AuditLogsService } from './application/services/audit-logs.service';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
