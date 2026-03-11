import { Module } from '@nestjs/common';
import { BudgetsService } from './application/services/budgets.service';
import { BudgetsController } from './infrastructure/controllers/budgets.controller';
import { PrismaBudgetsRepository } from './infrastructure/repositories/prisma-budgets.repository';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';
import { RuleTemplatesModule } from '../rule-templates/rule-templates.module';

@Module({
  imports: [PrismaModule, RuleTemplatesModule],
  controllers: [BudgetsController],
  providers: [
    BudgetsService,
    {
      provide: 'IBudgetsRepository',
      useClass: PrismaBudgetsRepository,
    },
  ],
  exports: [BudgetsService],
})
export class BudgetsModule {}
