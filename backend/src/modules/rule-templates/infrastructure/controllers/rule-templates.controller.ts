import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RuleTemplatesService } from '../../application/services/rule-templates.service';
import { CreateRuleTemplateDto } from '../../application/dtos/create-rule-template.dto';
import { UpdateRuleTemplateDto } from '../../application/dtos/update-rule-template.dto';

@ApiTags('Rule Templates (Motor de Regras)')
@Controller('rule-templates')
export class RuleTemplatesController {
  constructor(private readonly ruleTemplatesService: RuleTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rule template' })
  @ApiResponse({ status: 201, description: 'Rule template created successfully.' })
  create(@Body() createRuleTemplateDto: CreateRuleTemplateDto) {
    return this.ruleTemplatesService.create(createRuleTemplateDto);
  }

  @Get('evaluate')
  @ApiOperation({ summary: 'Evaluate rules based on Client and State priority' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Client ID parameter' })
  @ApiQuery({ name: 'stateUf', required: false, type: String, description: 'State UF parameter (e.g. SP, RJ)' })
  @ApiResponse({ status: 200, description: 'List of resolved winning rules for each Verba Type.' })
  evaluateRules(
    @Query('clientId') clientId?: string,
    @Query('stateUf') stateUf?: string,
  ) {
    return this.ruleTemplatesService.evaluateRules(clientId, stateUf);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rules with pagination' })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    const takeNumber = take ? parseInt(take, 10) : undefined;
    return this.ruleTemplatesService.findAll(cursor, takeNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single rule template by ID' })
  findOne(@Param('id') id: string) {
    return this.ruleTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule template' })
  update(@Param('id') id: string, @Body() updateRuleTemplateDto: UpdateRuleTemplateDto) {
    return this.ruleTemplatesService.update(id, updateRuleTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule template' })
  remove(@Param('id') id: string) {
    return this.ruleTemplatesService.remove(id);
  }
}
