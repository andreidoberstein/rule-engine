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
exports.CreateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateClientDto {
    client_code;
    client_name;
    document;
    email;
    job_codes;
    new_format_flag;
    created_by;
    is_active;
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C001', description: 'The unique code for the client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "client_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corp', description: 'The name of the client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "client_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678900', description: 'The document (e.g. CPF/CNPJ) of the client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contact@acmecorp.com', description: 'The email of the client' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'JOB1,JOB2', description: 'Job codes associated with the client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "job_codes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the new format flag is active' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateClientDto.prototype, "new_format_flag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-user', description: 'ID of the user who created this client' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Is the client active?' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateClientDto.prototype, "is_active", void 0);
//# sourceMappingURL=create-client.dto.js.map