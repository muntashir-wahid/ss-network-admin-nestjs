import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './providers/clients.service';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, ResponseFormatterService],
})
export class ClientsModule {}
