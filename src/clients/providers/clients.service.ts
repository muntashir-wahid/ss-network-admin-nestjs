import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { Status } from 'src/generated/prisma/enums';

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

  public async getAll() {
    const clients = await this.prismaService.client.findMany({
      select: {
        uid: true,
        clientName: true,
        contact: true,
        userId: true,
        package: true,
        addressLine: true,
      },
      where: {
        status: Status.ACTIVE,
      },
    });
    return this.responseFormatterService.formatPaginatedResponse(
      clients,
      1,
      10,
      clients.length,
    );
  }
}
