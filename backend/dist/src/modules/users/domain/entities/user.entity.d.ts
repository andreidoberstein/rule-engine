import { Role } from '@prisma/client';
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    constructor(partial: Partial<UserEntity>);
}
