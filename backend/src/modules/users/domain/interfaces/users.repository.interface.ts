import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  create(data: Omit<UserEntity, 'id' | 'created_at' | 'updated_at'>): Promise<UserEntity>;
  findAll(options?: { cursor?: string; take?: number }): Promise<{ data: UserEntity[], nextCursor: string | null }>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
