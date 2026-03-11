import type { IClientsRepository } from '../../domain/interfaces/clients.repository.interface';
import { CreateClientDto } from '../dtos/create-client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { ClientEntity } from '../../domain/entities/client.entity';
export declare class ClientsService {
    private readonly clientsRepository;
    constructor(clientsRepository: IClientsRepository);
    create(createClientDto: CreateClientDto): Promise<ClientEntity>;
    findAll(options?: {
        cursor?: string;
        take?: number;
    }): Promise<{
        data: ClientEntity[];
        nextCursor: string | null;
    }>;
    findOne(id: string): Promise<ClientEntity>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity>;
    remove(id: string): Promise<void>;
}
