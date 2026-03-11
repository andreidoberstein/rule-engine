import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || (!user.is_active) || !user.password) {
      throw new UnauthorizedException('Invalid credentials or inactive user.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials or inactive user.');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
