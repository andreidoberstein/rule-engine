import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IClientsRepository } from '../../domain/interfaces/clients.repository.interface';
import { ClientEntity } from '../../domain/entities/client.entity';

@Injectable()
export class PrismaClientsRepository implements IClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<ClientEntity, 'id' | 'created_at' | 'updated_at'>): Promise<ClientEntity> {
    const client = await this.prisma.client.create({
      data,
    });
    return this.mapToEntity(client);
  }

  async findAll(options?: { cursor?: string; take?: number }): Promise<{ data: ClientEntity[], nextCursor: string | null }> {
    const take = options?.take || 5;
    const cursor = options?.cursor;

    const clients = await this.prisma.client.findMany({
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { created_at: 'desc' },
    });

    let nextCursor: string | null = null;
    if (clients.length > take) {
      const nextItem = clients.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: clients.map(client => this.mapToEntity(client)),
      nextCursor,
    };
  }

  async findById(id: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) return null;
    return this.mapToEntity(client);
  }

  async update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity> {
    const client = await this.prisma.client.update({
      where: { id },
      data,
    });
    return this.mapToEntity(client);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }

  private mapToEntity(prismaClient: any): ClientEntity {
    return new ClientEntity({
      id: prismaClient.id,
      client_code: prismaClient.client_code,
      client_name: prismaClient.client_name,
      document: prismaClient.document,
      email: prismaClient.email,
      job_codes: prismaClient.job_codes,
      new_format_flag: prismaClient.new_format_flag,
      created_by: prismaClient.created_by,
      is_active: prismaClient.is_active,
      created_at: prismaClient.created_at,
      updated_at: prismaClient.updated_at,
    });
  }
}
