"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    name;
    email;
    password;
    role;
    is_active;
    created_at;
    updated_at;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map