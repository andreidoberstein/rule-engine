import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<void>;
}
