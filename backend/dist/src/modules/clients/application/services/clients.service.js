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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
let ClientsService = class ClientsService {
    clientsRepository;
    constructor(clientsRepository) {
        this.clientsRepository = clientsRepository;
    }
    async create(createClientDto) {
        return this.clientsRepository.create({
            client_code: createClientDto.client_code,
            client_name: createClientDto.client_name,
            document: createClientDto.document,
            email: createClientDto.email,
            job_codes: createClientDto.job_codes,
            new_format_flag: createClientDto.new_format_flag,
            created_by: createClientDto.created_by,
            is_active: createClientDto.is_active ?? true,
        });
    }
    async findAll(options) {
        return this.clientsRepository.findAll(options);
    }
    async findOne(id) {
        const client = await this.clientsRepository.findById(id);
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return client;
    }
    async update(id, updateClientDto) {
        await this.findOne(id);
        return this.clientsRepository.update(id, updateClientDto);
    }
    async remove(id) {
        await this.findOne(id);
        return this.clientsRepository.delete(id);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IClientsRepository')),
    __metadata("design:paramtypes", [Object])
], ClientsService);
//# sourceMappingURL=clients.service.js.map