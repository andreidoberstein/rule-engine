import { Module } from '@nestjs/common';
import { ClientsService } from './application/services/clients.service';
import { ClientsController } from './infrastructure/controllers/clients.controller';
import { PrismaClientsRepository } from './infrastructure/repositories/prisma-clients.repository';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    {
      provide: 'IClientsRepository',
      useClass: PrismaClientsRepository,
    },
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
