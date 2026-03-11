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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBudgetsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../infrastructure/database/prisma/prisma.service");
let PrismaBudgetsRepository = class PrismaBudgetsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const budget = await this.prisma.budget.create({
            data: {
                client_id: data.client_id,
                status: data.status,
                dates: data.dates,
                total: data.total,
                roles: {
                    create: data.roles?.map((r) => ({
                        role_id: r.role_id,
                        state_uf: r.state_uf,
                        headcount: r.headcount,
                        verbas: {
                            create: r.verbas?.map((v) => ({
                                verba_type_id: v.verba_type_id,
                                calc_type: v.calc_type,
                                value: v.value,
                            })) || []
                        }
                    })) || []
                }
            },
            include: { client: true },
        });
        return this.mapToEntity(budget);
    }
    async findAll(options) {
        const { cursor, take } = options;
        const limit = take || 5;
        const budgets = await this.prisma.budget.findMany({
            take: limit + 1,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { created_at: 'desc' },
            include: { client: true },
        });
        let nextCursor = null;
        if (budgets.length > limit) {
            const nextItem = budgets.pop();
            nextCursor = nextItem?.id || null;
        }
        return {
            data: budgets.map(this.mapToEntity),
            nextCursor,
        };
    }
    async findById(id) {
        const budget = await this.prisma.budget.findUnique({
            where: { id },
            include: { client: true },
        });
        return budget ? this.mapToEntity(budget) : null;
    }
    async update(id, data) {
        const budget = await this.prisma.budget.update({
            where: { id },
            data,
            include: { client: true },
        });
        return this.mapToEntity(budget);
    }
    async delete(id) {
        await this.prisma.budget.delete({ where: { id } });
    }
    async getVerbaTypes() {
        return this.prisma.verbaType.findMany({
            orderBy: { group_id: 'asc' },
            include: { group: true }
        });
    }
    async getReferenceData() {
        const areas = await this.prisma.area.findMany();
        const roles = await this.prisma.roleType.findMany();
        return { areas, roles };
    }
    mapToEntity(prismaBudget) {
        return {
            id: prismaBudget.id,
            client_id: prismaBudget.client_id,
            status: prismaBudget.status,
            dates: prismaBudget.dates,
            total: Number(prismaBudget.total),
            created_at: prismaBudget.created_at,
            updated_at: prismaBudget.updated_at,
        };
    }
};
exports.PrismaBudgetsRepository = PrismaBudgetsRepository;
exports.PrismaBudgetsRepository = PrismaBudgetsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaBudgetsRepository);
//# sourceMappingURL=prisma-budgets.repository.js.map