import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { Status } from 'src/generated/prisma/enums';
import { CreateBulkClientsDto } from '../dtos/create-bulk-clients.dto';
import UpdateClientDto from '../dtos/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    const client = await this.prismaService.client.create({
      data: createClientDto,
    });

    return this.responseFormatterService.formatSuccessResponse(
      client,
      'Client created successfully',
    );
  }

  public async createBulk(createBulkClientsDto: CreateBulkClientsDto) {
    const clients = await this.prismaService.client.createMany({
      data: createBulkClientsDto.clients,
      skipDuplicates: true,
    });
    return this.responseFormatterService.formatSuccessResponse(
      clients,
      'Clients created successfully',
    );
  }

  public async getBulk() {
    const clients = await this.prismaService.client.findMany({
      where: {
        status: Status.ACTIVE,
      },
      select: {
        clientName: true,
        contact: true,
        userId: true,
        package: true,
        addressLine: true,
        connectionDate: true,
        zone: {
          select: {
            zoneName: true,
          },
        },
      },
    });

    return this.responseFormatterService.formatSuccessResponse(
      clients,
      'Clients fetched successfully',
    );
  }

  public async getAll(
    page: number,
    limit: number,
    search: string,
    status: Status,
    zoneUid?: string,
  ) {
    const clients = await this.prismaService.client.findMany({
      select: {
        uid: true,
        clientName: true,
        contact: true,
        userId: true,
        package: true,
        addressLine: true,
        connectionDate: true,
        mpbsProvided: true,
        email: true,
        packagePrice: true,
        status: true,
        zone: {
          select: {
            zoneName: true,
            uid: true,
          },
        },
      },
      where: {
        status: status,
        ...(zoneUid ? { zoneId: zoneUid } : {}),
        ...(search
          ? {
              OR: [
                { clientName: { contains: search, mode: 'insensitive' } },
                { userId: { contains: search, mode: 'insensitive' } },
                { contact: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        connectionDate: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalClients = await this.prismaService.client.count({
      where: {
        status: status,
        ...(zoneUid ? { zoneId: zoneUid } : {}),
        ...(search
          ? {
              OR: [
                { clientName: { contains: search, mode: 'insensitive' } },
                { userId: { contains: search, mode: 'insensitive' } },
                { contact: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      clients,
      page,
      limit,
      totalClients,
    );
  }

  public async findOne(uid: string) {
    const client = await this.prismaService.client.findUnique({
      where: { uid },
    });
    return this.responseFormatterService.formatSuccessResponse(
      client,
      'Client fetched successfully',
    );
  }

  public async deleteOne(uid: string) {
    const deletedClient = await this.prismaService.client.update({
      where: { uid },
      data: { status: Status.DISABLED },
    });

    return this.responseFormatterService.formatSuccessResponse(
      deletedClient,
      'Client deleted successfully',
    );
  }

  public async updateByUid(uid: string, updateClientDto: UpdateClientDto) {
    // Placeholder for update logic
    const updatedClient = await this.prismaService.client.update({
      where: { uid },
      data: updateClientDto,
    });

    return this.responseFormatterService.formatSuccessResponse(
      updatedClient,
      'Client updated successfully',
    );
  }

  public async getClientStats() {
    const [totalClients, activeClients, disabledClients] = await Promise.all([
      this.prismaService.client.count(),
      this.prismaService.client.count({ where: { status: Status.ACTIVE } }),
      this.prismaService.client.count({ where: { status: Status.DISABLED } }),
    ]);

    return this.responseFormatterService.formatSuccessResponse(
      {
        totalClients,
        activeClients,
        disabledClients,
      },
      'Client statistics fetched successfully',
    );
  }

  public async getPaymentsByClientUid(uid: string, year?: number) {
    const currentYear = year || new Date().getFullYear();

    const payments = await this.prismaService.payment.findMany({
      where: {
        clientId: uid,
        paymentYear: currentYear,
      },
      select: {
        uid: true,
        amount: true,
        paymentMonth: true,
        paymentYear: true,
        createdAt: true,
        note: true,
      },
    });

    // Create a map of payments by month for quick lookup
    const paymentMap = new Map<number, (typeof payments)[0]>();
    payments.forEach((payment) => {
      paymentMap.set(payment.paymentMonth, payment);
    });

    // Generate all 12 months with payment status
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

    const monthlyPayments = monthNames.map((monthName, index) => {
      const month = index + 1;
      const payment = paymentMap.get(month);

      if (payment) {
        return {
          month,
          monthName,
          year: currentYear,
          status: 'COMPLETED',
          paymentDetails: payment,
        };
      } else {
        return {
          month,
          monthName,
          year: currentYear,
          status: 'PENDING',
          paymentDetails: null,
        };
      }
    });

    return this.responseFormatterService.formatSuccessResponse(
      {
        year: currentYear,
        totalMonths: 12,
        completedPayments: payments.length,
        pendingPayments: 12 - payments.length,
        monthlyPayments,
      },
      'Client payments fetched successfully',
    );
  }

  public async getClientListByPaymentStatus(
    page: number,
    limit: number,
    month: number,
    year: number,
    status: 'PAID' | 'UNPAID',
  ) {
    const filterQuery =
      status === 'PAID'
        ? {
            some: {
              paymentMonth: month,
              paymentYear: year,
            },
          }
        : {
            none: {
              paymentMonth: month,
              paymentYear: year,
            },
          };

    const clients = await this.prismaService.client.findMany({
      where: {
        status: Status.ACTIVE,
        payments: filterQuery,
      },
      select: {
        uid: true,
        clientName: true,
        contact: true,
        userId: true,
        addressLine: true,
        packagePrice: true,
        connectionDate: true,
      },
    });

    const totalClients = await this.prismaService.client.count({
      where: {
        status: Status.ACTIVE,
        payments: filterQuery,
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      clients,
      page,
      limit,
      totalClients,
    );
  }
}
