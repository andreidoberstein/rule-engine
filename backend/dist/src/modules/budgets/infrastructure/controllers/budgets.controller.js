"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const budgets_service_1 = require("../../application/services/budgets.service");
const create_budget_dto_1 = require("../../application/dtos/create-budget.dto");
const update_budget_dto_1 = require("../../application/dtos/update-budget.dto");
let BudgetsController = class BudgetsController {
    budgetsService;
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    getVerbaTypes() {
        return this.budgetsService.getVerbaTypes();
    }
    getReferenceData() {
        return this.budgetsService.getReferenceData();
    }
    simulate(simulateBudgetDto) {
        return this.budgetsService.simulate(simulateBudgetDto);
    }
    create(createBudgetDto) {
        return this.budgetsService.create(createBudgetDto);
    }
    findAll(cursor, take) {
        const takeNumber = take ? parseInt(take, 10) : undefined;
        return this.budgetsService.findAll(cursor, takeNumber);
    }
    findOne(id) {
        return this.budgetsService.findOne(id);
    }
    update(id, updateBudgetDto) {
        return this.budgetsService.update(id, updateBudgetDto);
    }
    remove(id) {
        return this.budgetsService.remove(id);
    }
};
exports.BudgetsController = BudgetsController;
__decorate([
    (0, common_1.Get)('verba-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all static verba types and their groups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Verba Types returned successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "getVerbaTypes", null);
__decorate([
    (0, common_1.Get)('reference-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Areas and Roles for dropdowns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reference data returned successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "getReferenceData", null);
__decorate([
    (0, common_1.Post)('simulate'),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate budget calculation based on roles/states and Rules Engine' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simulated math returned successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budget_dto_1.SimulateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "simulate", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new budget' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The budget has been successfully created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budget_dto_1.CreateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all budgets with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false, type: String, description: 'Cursor to start fetching from' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of budgets returned successfully.' }),
    __param(0, (0, common_1.Query)('cursor')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a budget by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The budget returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Budget not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a budget' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The budget has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Budget not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_budget_dto_1.UpdateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a budget' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The budget has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Budget not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "remove", null);
exports.BudgetsController = BudgetsController = __decorate([
    (0, swagger_1.ApiTags)('Budgets'),
    (0, common_1.Controller)('budgets'),
    __metadata("design:paramtypes", [budgets_service_1.BudgetsService])
], BudgetsController);
//# sourceMappingURL=budgets.controller.js.map