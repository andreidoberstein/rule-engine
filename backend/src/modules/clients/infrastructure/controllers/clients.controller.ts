import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from '../../application/services/clients.service';
import { CreateClientDto } from '../../application/dtos/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/update-client.dto';
import { ClientEntity } from '../../domain/entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created.', type: ClientEntity })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients (paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Cursor for pagination (Client ID)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to return (Default: 5)' })
  @ApiResponse({ status: 200, description: 'Return paginated clients.' })
  findAll(
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    const takeNumber = take ? parseInt(take, 10) : 5;
    return this.clientsService.findAll({ cursor, take: takeNumber });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Return a single client.', type: ClientEntity })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client successfully updated.', type: ClientEntity })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
