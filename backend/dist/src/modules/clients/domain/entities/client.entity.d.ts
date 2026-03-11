export declare class ClientEntity {
    id: string;
    client_code: string;
    client_name: string;
    document: string;
    email: string;
    job_codes: string;
    new_format_flag: boolean;
    created_by: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    constructor(partial: Partial<ClientEntity>);
}
