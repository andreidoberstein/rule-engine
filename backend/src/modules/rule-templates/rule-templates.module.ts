import { Module } from '@nestjs/common';
import { RuleTemplatesService } from './application/services/rule-templates.service';
import { RuleTemplatesController } from './infrastructure/controllers/rule-templates.controller';
import { PrismaRuleTemplatesRepository } from './infrastructure/repositories/prisma-rule-templates.repository';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RuleTemplatesController],
  providers: [
    RuleTemplatesService,
    {
      provide: 'IRuleTemplatesRepository',
      useClass: PrismaRuleTemplatesRepository,
    },
  ],
  exports: [RuleTemplatesService],
})
export class RuleTemplatesModule {}
