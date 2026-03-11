import type { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: IUsersRepository);
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<void>;
}
