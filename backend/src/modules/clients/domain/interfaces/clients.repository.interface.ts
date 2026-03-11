import { ClientEntity } from '../entities/client.entity';

export interface IClientsRepository {
  create(data: Omit<ClientEntity, 'id' | 'created_at' | 'updated_at'>): Promise<ClientEntity>;
  findAll(options?: { cursor?: string; take?: number }): Promise<{ data: ClientEntity[], nextCursor: string | null }>;
  findById(id: string): Promise<ClientEntity | null>;
  update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity>;
  delete(id: string): Promise<void>;
}
