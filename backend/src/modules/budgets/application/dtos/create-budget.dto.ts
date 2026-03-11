import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class BudgetVerbaDto {
  @ApiProperty()
  @IsUUID()
  verba_type_id: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  calc_type: string;
}

export class BudgetRoleDto {
  @ApiProperty()
  @IsUUID()
  role_id: string;

  @ApiProperty()
  @IsString()
  state_uf: string;

  @ApiProperty()
  @IsNumber()
  headcount: number;

  @ApiProperty({ type: [BudgetVerbaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVerbaDto)
  verbas: BudgetVerbaDto[];
}

export class CreateBudgetDto {
  @ApiProperty({ example: 'uuid', description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ example: 'DRAFT', description: 'Budget status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: '2024 - 2025', description: 'Budget valid dates' })
  @IsString()
  @IsOptional()
  dates?: string;

  @ApiProperty({ example: 50000.00, description: 'Total value of the budget' })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({ type: [BudgetRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetRoleDto)
  roles: BudgetRoleDto[];
}

export class SimulateBudgetDto {
  @ApiProperty()
  @IsUUID()
  client_id: string;

  @ApiProperty()
  @IsArray()
  roles: { role_id: string; state_uf: string; headcount: number }[];
}
