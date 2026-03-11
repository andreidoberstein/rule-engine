import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditLogsService } from '../../application/services/audit-logs.service';

@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system audit logs' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Cursor to start fetching from' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to return' })
  @ApiResponse({ status: 200, description: 'List of logs returned successfully.' })
  findAll(
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    const takeNumber = take ? parseInt(take, 10) : undefined;
    return this.auditLogsService.findAll({ cursor, take: takeNumber });
  }
}
