import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
  ) {}

  public async processPayment(createPaymentDto: CreatePaymentDto) {
    const payment = await this.prismaService.payment.create({
      data: createPaymentDto,
    });

    return this.responseFormatterService.formatSuccessResponse(
      payment,
      'Payment processed successfully',
    );
  }

  public async findAll() {
    const payments = await this.prismaService.payment.findMany({
      select: {
        uid: true,
        amount: true,
        paymentMonth: true,
        paymentYear: true,
        createdAt: true,
        client: {
          select: {
            uid: true,
            clientName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      payments,
      1,
      10,
      payments.length,
    );
  }
}
