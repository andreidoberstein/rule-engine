"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerbaTypeEntity = exports.VerbaGroupEntity = exports.RoleTypeEntity = exports.AreaEntity = void 0;
class AreaEntity {
    id;
    name;
    is_active;
    created_at;
    updated_at;
}
exports.AreaEntity = AreaEntity;
class RoleTypeEntity {
    id;
    name;
    area_id;
    is_active;
    created_at;
    updated_at;
}
exports.RoleTypeEntity = RoleTypeEntity;
class VerbaGroupEntity {
    id;
    name;
    is_active;
    created_at;
    updated_at;
}
exports.VerbaGroupEntity = VerbaGroupEntity;
class VerbaTypeEntity {
    id;
    name;
    group_id;
    is_active;
    created_at;
    updated_at;
}
exports.VerbaTypeEntity = VerbaTypeEntity;
//# sourceMappingURL=domain.entity.js.map