import { Module } from '@nestjs/common';
import { ZoneController } from './zone.controller';
import { ZoneService } from './providers/zone.service';
import { PrismaService } from 'src/prisma.service';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';

@Module({
  controllers: [ZoneController],
  providers: [ZoneService, PrismaService, ResponseFormatterService],
})
export class ZoneModule {}
