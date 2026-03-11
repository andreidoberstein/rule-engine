import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { RuleTemplatesModule } from './modules/rule-templates/rule-templates.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ClientsModule, BudgetsModule, RuleTemplatesModule, AuditLogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
