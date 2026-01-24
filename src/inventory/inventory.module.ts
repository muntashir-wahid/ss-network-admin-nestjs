import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './providers/inventory.service';
import { PrismaService } from 'src/prisma.service';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService, ResponseFormatterService],
})
export class InventoryModule {}
