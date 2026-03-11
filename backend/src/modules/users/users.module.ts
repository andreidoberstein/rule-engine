import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from './infrastructure/controllers/users.controller';
import { PrismaUsersRepository } from './infrastructure/repositories/prisma-users.repository';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
