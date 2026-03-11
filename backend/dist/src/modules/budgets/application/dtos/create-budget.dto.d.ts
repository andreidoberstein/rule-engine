export declare class BudgetVerbaDto {
    verba_type_id: string;
    value: number;
    calc_type: string;
}
export declare class BudgetRoleDto {
    role_id: string;
    state_uf: string;
    headcount: number;
    verbas: BudgetVerbaDto[];
}
export declare class CreateBudgetDto {
    client_id: string;
    status: string;
    dates?: string;
    total: number;
    roles: BudgetRoleDto[];
}
export declare class SimulateBudgetDto {
    client_id: string;
    roles: {
        role_id: string;
        state_uf: string;
        headcount: number;
    }[];
}
