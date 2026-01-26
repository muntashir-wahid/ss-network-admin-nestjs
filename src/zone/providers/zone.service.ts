import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateZoneDto } from '../dtos/create-zone.dto';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';

@Injectable()
export class ZoneService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
  ) {}

  public async create(createZoneDto: CreateZoneDto) {
    const zone = await this.prismaService.zone.create({
      data: {
        zoneName: createZoneDto.zoneName,
        areas: {
          createMany: {
            data: [
              ...createZoneDto.areaNames.map((name) => ({ areaName: name })),
            ],
          },
        },
      },
    });

    return this.responseFormatterService.formatSuccessResponse(
      zone,
      'Zone created successfully',
    );
  }

  public async findAll(page: number, limit: number) {
    const zones = await this.prismaService.zone.findMany({
      select: {
        uid: true,
        zoneName: true,
        createdAt: true,
        areas: {
          select: {
            uid: true,
            areaName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalItems = await this.prismaService.zone.count();

    return this.responseFormatterService.formatPaginatedResponse(
      zones,
      page,
      limit,
      totalItems,
    );
  }
}
