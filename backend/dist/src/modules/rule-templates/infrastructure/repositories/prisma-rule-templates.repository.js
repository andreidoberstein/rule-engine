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
exports.PrismaRuleTemplatesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../infrastructure/database/prisma/prisma.service");
let PrismaRuleTemplatesRepository = class PrismaRuleTemplatesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const rule = await this.prisma.ruleTemplate.create({
            data: {
                client_id: data.client_id,
                state_uf: data.state_uf,
                verba_type_id: data.verba_type_id,
                calc_type: data.calc_type,
                value: data.value,
                text_value: data.text_value,
            },
            include: { verba_type: true },
        });
        return this.mapToEntity(rule);
    }
    async findAll(options) {
        const { cursor, take } = options;
        const limit = take || 10;
        const rules = await this.prisma.ruleTemplate.findMany({
            take: limit + 1,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { created_at: 'desc' },
            include: { verba_type: true, client: true },
        });
        let nextCursor = null;
        if (rules.length > limit) {
            const nextItem = rules.pop();
            nextCursor = nextItem?.id || null;
        }
        console.log(rules.map(this.mapToEntity));
        return {
            data: rules.map(this.mapToEntity),
            nextCursor,
        };
    }
    async findById(id) {
        const rule = await this.prisma.ruleTemplate.findUnique({
            where: { id },
            include: { verba_type: true, client: true },
        });
        return rule ? this.mapToEntity(rule) : null;
    }
    async evaluateRules(clientId, stateUf) {
        const applicableRules = await this.prisma.ruleTemplate.findMany({
            where: {
                OR: [
                    { client_id: clientId || null, state_uf: stateUf || null },
                    { client_id: clientId || null, state_uf: null },
                    { client_id: null, state_uf: stateUf || null },
                    { client_id: null, state_uf: null }
                ]
            },
            include: { verba_type: true }
        });
        const rulesMap = new Map();
        applicableRules.forEach((rule) => {
            let score = 0;
            if (rule.client_id)
                score += 2;
            if (rule.state_uf)
                score += 1;
            const existingRule = rulesMap.get(rule.verba_type_id);
            if (!existingRule || existingRule.score < score) {
                rulesMap.set(rule.verba_type_id, { rule, score });
            }
        });
        return Array.from(rulesMap.values()).map(r => this.mapToEntity(r.rule));
    }
    async update(id, data) {
        const rule = await this.prisma.ruleTemplate.update({
            where: { id },
            data: {
                client_id: data.client_id !== undefined ? data.client_id : undefined,
                state_uf: data.state_uf !== undefined ? data.state_uf : undefined,
                verba_type_id: data.verba_type_id !== undefined ? data.verba_type_id : undefined,
                calc_type: data.calc_type !== undefined ? data.calc_type : undefined,
                value: data.value !== undefined ? data.value : undefined,
                text_value: data.text_value !== undefined ? data.text_value : undefined,
            },
            include: { verba_type: true, client: true },
        });
        return this.mapToEntity(rule);
    }
    async delete(id) {
        await this.prisma.ruleTemplate.delete({ where: { id } });
    }
    mapToEntity(prismaRule) {
        return {
            id: prismaRule.id,
            client_id: prismaRule.client_id,
            state_uf: prismaRule.state_uf,
            verba_type_id: prismaRule.verba_type_id,
            calc_type: prismaRule.calc_type,
            value: Number(prismaRule.value),
            text_value: prismaRule.text_value,
            created_at: prismaRule.created_at,
            updated_at: prismaRule.updated_at,
        };
    }
};
exports.PrismaRuleTemplatesRepository = PrismaRuleTemplatesRepository;
exports.PrismaRuleTemplatesRepository = PrismaRuleTemplatesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRuleTemplatesRepository);
//# sourceMappingURL=prisma-rule-templates.repository.js.map