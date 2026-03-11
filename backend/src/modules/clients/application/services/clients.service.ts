import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IClientsRepository } from '../../domain/interfaces/clients.repository.interface';
import { CreateClientDto } from '../dtos/create-client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { ClientEntity } from '../../domain/entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('IClientsRepository')
    private readonly clientsRepository: IClientsRepository,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    return this.clientsRepository.create({
      client_code: createClientDto.client_code,
      client_name: createClientDto.client_name,
      document: createClientDto.document,
      email: createClientDto.email,
      job_codes: createClientDto.job_codes,
      new_format_flag: createClientDto.new_format_flag,
      created_by: createClientDto.created_by,
      is_active: createClientDto.is_active ?? true,
    });
  }

  async findAll(options?: { cursor?: string; take?: number }): Promise<{ data: ClientEntity[], nextCursor: string | null }> {
    return this.clientsRepository.findAll(options);
  }

  async findOne(id: string): Promise<ClientEntity> {
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    await this.findOne(id);
    return this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    return this.clientsRepository.delete(id);
  }
}
