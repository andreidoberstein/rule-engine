export declare class AreaEntity {
    id: string;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class RoleTypeEntity {
    id: string;
    name: string;
    area_id: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class VerbaGroupEntity {
    id: string;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class VerbaTypeEntity {
    id: string;
    name: string;
    group_id: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
