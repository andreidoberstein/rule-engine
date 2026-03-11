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
exports.PrismaClientsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../infrastructure/database/prisma/prisma.service");
const client_entity_1 = require("../../domain/entities/client.entity");
let PrismaClientsRepository = class PrismaClientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const client = await this.prisma.client.create({
            data,
        });
        return this.mapToEntity(client);
    }
    async findAll(options) {
        const take = options?.take || 5;
        const cursor = options?.cursor;
        const clients = await this.prisma.client.findMany({
            take: take + 1,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { created_at: 'desc' },
        });
        let nextCursor = null;
        if (clients.length > take) {
            const nextItem = clients.pop();
            nextCursor = nextItem.id;
        }
        return {
            data: clients.map(client => this.mapToEntity(client)),
            nextCursor,
        };
    }
    async findById(id) {
        const client = await this.prisma.client.findUnique({ where: { id } });
        if (!client)
            return null;
        return this.mapToEntity(client);
    }
    async update(id, data) {
        const client = await this.prisma.client.update({
            where: { id },
            data,
        });
        return this.mapToEntity(client);
    }
    async delete(id) {
        await this.prisma.client.delete({ where: { id } });
    }
    mapToEntity(prismaClient) {
        return new client_entity_1.ClientEntity({
            id: prismaClient.id,
            client_code: prismaClient.client_code,
            client_name: prismaClient.client_name,
            document: prismaClient.document,
            email: prismaClient.email,
            job_codes: prismaClient.job_codes,
            new_format_flag: prismaClient.new_format_flag,
            created_by: prismaClient.created_by,
            is_active: prismaClient.is_active,
            created_at: prismaClient.created_at,
            updated_at: prismaClient.updated_at,
        });
    }
};
exports.PrismaClientsRepository = PrismaClientsRepository;
exports.PrismaClientsRepository = PrismaClientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaClientsRepository);
//# sourceMappingURL=prisma-clients.repository.js.map