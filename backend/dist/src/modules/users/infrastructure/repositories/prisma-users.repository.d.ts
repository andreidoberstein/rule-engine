import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class PrismaUsersRepository implements IUsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Omit<UserEntity, 'id' | 'created_at' | 'updated_at'>): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
    delete(id: string): Promise<void>;
    private mapToEntity;
}
