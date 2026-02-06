import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './providers/payments.service';
import { PrismaService } from 'src/prisma.service';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, ResponseFormatterService],
})
export class PaymentsModule {}
