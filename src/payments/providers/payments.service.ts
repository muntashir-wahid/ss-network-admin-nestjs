import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { Status } from 'src/generated/prisma/enums';

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

  public async findAll(page: number, limit: number, search: string) {
    const payments = await this.prismaService.payment.findMany({
      where: {
        ...(search
          ? {
              client: {
                OR: [
                  { clientName: { contains: search, mode: 'insensitive' } },
                  { userId: { contains: search, mode: 'insensitive' } },
                  { contact: { contains: search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
      },
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

    const totalPayments = await this.prismaService.payment.count({
      where: {
        ...(search
          ? {
              client: {
                OR: [
                  { clientName: { contains: search, mode: 'insensitive' } },
                  { userId: { contains: search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      payments,
      page,
      limit,
      totalPayments,
    );
  }

  public async getPaymentStats(month: number, year: number) {
    const [totalExecutedPayments, totalPaymentReceived] = await Promise.all([
      this.prismaService.client.aggregate({
        where: {
          status: Status.ACTIVE,
        },
        _sum: {
          packagePrice: true,
        },
      }),
      this.prismaService.payment.aggregate({
        where: {
          paymentMonth: month,
          paymentYear: year,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return this.responseFormatterService.formatSuccessResponse(
      {
        totalExecutedPayments: totalExecutedPayments._sum.packagePrice || 0,
        totalPaymentReceived: totalPaymentReceived._sum.amount || 0,
      },
      'Payment statistics retrieved successfully',
    );
  }

  public async getRevenueStats(year: number) {
    const revenueStats = await this.prismaService.payment.groupBy({
      by: ['paymentMonth'],
      where: {
        paymentYear: year,
      },
      _sum: {
        amount: true,
      },
    });

    // Month names array
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Create a map of existing months for quick lookup
    const monthRevenueMap = new Map<number, string>();
    revenueStats.forEach((stat) => {
      monthRevenueMap.set(
        stat.paymentMonth,
        stat._sum.amount?.toString() || '0',
      );
    });

    // Generate data for all 12 months with flattened structure
    const completeRevenueStats = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: monthNames[index],
        amount: monthRevenueMap.get(monthNumber) || '0',
      };
    });

    return this.responseFormatterService.formatSuccessResponse(
      completeRevenueStats,
      'Revenue statistics retrieved successfully',
    );
  }
}
