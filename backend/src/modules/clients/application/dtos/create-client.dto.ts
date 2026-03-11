import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'C001', description: 'The unique code for the client' })
  @IsString()
  @IsNotEmpty()
  client_code: string;

  @ApiProperty({ example: 'Acme Corp', description: 'The name of the client' })
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @ApiProperty({ example: '12345678900', description: 'The document (e.g. CPF/CNPJ) of the client' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ example: 'contact@acmecorp.com', description: 'The email of the client' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'JOB1,JOB2', description: 'Job codes associated with the client' })
  @IsString()
  @IsNotEmpty()
  job_codes: string;

  @ApiProperty({ example: true, description: 'Whether the new format flag is active' })
  @IsBoolean()
  new_format_flag: boolean;

  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the user who created this client' })
  @IsUUID()
  @IsNotEmpty()
  created_by: string;

  @ApiPropertyOptional({ example: true, description: 'Is the client active?' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
