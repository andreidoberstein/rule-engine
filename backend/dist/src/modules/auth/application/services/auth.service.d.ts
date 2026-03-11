import { UsersService } from '../../../users/application/services/users.service';
import { LoginDto } from '../dtos/login.dto';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
}
