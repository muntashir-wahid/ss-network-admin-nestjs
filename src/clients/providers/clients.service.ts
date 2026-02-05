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
        zone: {
          select: {
            zoneName: true,
          },
        },
      },
      where: {
        status: status,
        ...(zoneUid ? { zoneId: zoneUid } : {}),
        clientName: {
          contains: search,
          mode: 'insensitive',
        },
        userId: {
          contains: search,
          mode: 'insensitive',
        },
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
}
