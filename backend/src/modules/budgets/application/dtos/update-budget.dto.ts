import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';
export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @ApiPropertyOptional({ example: 'uuid', description: 'ID of the user making the update for audit logs' })
  @IsUUID()
  @IsOptional()
  user_id?: string;
}
