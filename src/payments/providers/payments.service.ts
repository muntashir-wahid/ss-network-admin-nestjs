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

  public async findAll(page: number, limit: number) {
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
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPayments = await this.prismaService.payment.count();

    return this.responseFormatterService.formatPaginatedResponse(
      payments,
      page,
      limit,
      totalPayments,
    );
  }
}
