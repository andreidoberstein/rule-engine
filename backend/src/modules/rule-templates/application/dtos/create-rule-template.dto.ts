import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateRuleTemplateDto {
  @ApiPropertyOptional({ example: 'uuid', description: 'Client ID - null means global rule' })
  @IsUUID()
  @IsOptional()
  client_id?: string;

  @ApiPropertyOptional({ example: 'SP', description: 'State UF - null means global state' })
  @IsString()
  @IsOptional()
  state_uf?: string;

  @ApiProperty({ example: 'uuid', description: 'Relation to Verba Type' })
  @IsUUID()
  @IsNotEmpty()
  verba_type_id: string;

  @ApiProperty({ example: 'FIXED', description: 'Calculation type: FIXED, PERCENTAGE_BASE, PERCENTAGE_TOTAL...' })
  @IsString()
  @IsNotEmpty()
  calc_type: string;

  @ApiProperty({ example: 1200.50, description: 'Numeric value of rule if applicable' })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiPropertyOptional({ example: 'Custom Text', description: 'Text value if CalcType is TEXT' })
  @IsString()
  @IsOptional()
  text_value?: string;
}
