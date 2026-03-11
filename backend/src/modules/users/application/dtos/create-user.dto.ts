import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpass123', description: 'The user password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER, description: 'The role of the user' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true, description: 'Is the user active?' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
