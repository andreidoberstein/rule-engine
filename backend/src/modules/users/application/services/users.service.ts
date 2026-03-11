import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role ?? Role.USER,
      is_active: createUserDto.is_active ?? true,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    return this.usersRepository.delete(id);
  }
}
