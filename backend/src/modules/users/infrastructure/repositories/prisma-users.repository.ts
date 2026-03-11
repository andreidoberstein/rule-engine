import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<UserEntity, 'id' | 'created_at' | 'updated_at'>): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: Object.assign({}, data, { password: data.password! }),
    });
    return this.mapToEntity(user);
  }

  async findAll(options?: { cursor?: string; take?: number }): Promise<{ data: UserEntity[], nextCursor: string | null }> {
    const take = options?.take || 5;
    const cursor = options?.cursor;

    const users = await this.prisma.user.findMany({
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { created_at: 'desc' }
    });

    let nextCursor: string | null = null;
    if (users.length > take) {
      const nextItem = users.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: users.map(user => this.mapToEntity(user)),
      nextCursor,
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private mapToEntity(prismaUser: any): UserEntity {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role,
      is_active: prismaUser.is_active,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
    };
  }
}
