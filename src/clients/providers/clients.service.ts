import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { Status } from 'src/generated/prisma/enums';
import { CreateBulkClientsDto } from '../dtos/create-bulk-clients.dto';

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
    zone?: string,
  ) {
    const clients = await this.prismaService.client.findMany({
      select: {
        uid: true,
        clientName: true,
        contact: true,
        userId: true,
        package: true,
        addressLine: true,
        zone: {
          select: {
            zoneName: true,
          },
        },
      },
      where: {
        status: status,
        ...(zone ? { zoneId: zone } : {}),
        clientName: {
          contains: search,
          mode: 'insensitive',
        },
        userId: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalClients = await this.prismaService.client.count({
      where: {
        status: status,
        ...(zone ? { zoneId: zone } : {}),
        clientName: {
          contains: search,
          mode: 'insensitive',
        },
        userId: {
          contains: search,
          mode: 'insensitive',
        },
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
}
