"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEntity = void 0;
class ClientEntity {
    id;
    client_code;
    client_name;
    document;
    email;
    job_codes;
    new_format_flag;
    created_by;
    is_active;
    created_at;
    updated_at;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ClientEntity = ClientEntity;
//# sourceMappingURL=client.entity.js.map