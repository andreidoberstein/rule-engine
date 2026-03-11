import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BudgetsService } from '../../application/services/budgets.service';
import { CreateBudgetDto, SimulateBudgetDto } from '../../application/dtos/create-budget.dto';
import { UpdateBudgetDto } from '../../application/dtos/update-budget.dto';

@ApiTags('Budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get('verba-types')
  @ApiOperation({ summary: 'Get all static verba types and their groups' })
  @ApiResponse({ status: 200, description: 'List of Verba Types returned successfully.' })
  getVerbaTypes() {
    return this.budgetsService.getVerbaTypes();
  }

  @Get('reference-data')
  @ApiOperation({ summary: 'Get Areas and Roles for dropdowns' })
  @ApiResponse({ status: 200, description: 'Reference data returned successfully.' })
  getReferenceData() {
    return this.budgetsService.getReferenceData();
  }

  @Post('simulate')
  @ApiOperation({ summary: 'Simulate budget calculation based on roles/states and Rules Engine' })
  @ApiResponse({ status: 200, description: 'Simulated math returned successfully.' })
  simulate(@Body() simulateBudgetDto: SimulateBudgetDto) {
    return this.budgetsService.simulate(simulateBudgetDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'The budget has been successfully created.' })
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets with pagination' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Cursor to start fetching from' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to return' })
  @ApiResponse({ status: 200, description: 'List of budgets returned successfully.' })
  findAll(
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    const takeNumber = take ? parseInt(take, 10) : undefined;
    return this.budgetsService.findAll(cursor, takeNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget by id' })
  @ApiResponse({ status: 200, description: 'The budget returned successfully.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  @ApiResponse({ status: 200, description: 'The budget has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  @ApiResponse({ status: 200, description: 'The budget has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
