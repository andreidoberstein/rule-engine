import { ClientsService } from '../../application/services/clients.service';
import { CreateClientDto } from '../../application/dtos/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/update-client.dto';
import { ClientEntity } from '../../domain/entities/client.entity';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<ClientEntity>;
    findAll(cursor?: string, take?: string): Promise<{
        data: ClientEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<ClientEntity>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity>;
    remove(id: string): Promise<void>;
}
