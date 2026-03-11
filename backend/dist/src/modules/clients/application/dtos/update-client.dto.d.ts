import { CreateClientDto } from './create-client.dto';
declare const UpdateClientDto_base: import("@nestjs/common").Type<Partial<Omit<CreateClientDto, "created_by">>>;
export declare class UpdateClientDto extends UpdateClientDto_base {
}
export {};
