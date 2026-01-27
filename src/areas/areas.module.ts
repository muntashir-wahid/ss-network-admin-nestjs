import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './providers/areas.service';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AreasController],
  providers: [AreasService, PrismaService, ResponseFormatterService],
})
export class AreasModule {}
