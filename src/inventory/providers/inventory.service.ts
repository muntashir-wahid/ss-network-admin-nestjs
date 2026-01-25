import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryItemDto } from '../dtos/create-inventory-item.dto';
import { InventoryLogType, StockQueryType } from '../inventory.controller';
import { PatchInventoryLogDto } from '../dtos/patch-inventory-item.dto';
import { UpdateInventoryItemProvider } from './update-inventory-item.provider';

function stockQuery(stock: StockQueryType) {
  if (stock === 'ALL') {
    return {};
  } else if (stock === 'IN_STOCK') {
    return { gte: 10 };
  } else if (stock === 'MEDIUM') {
    return { gte: 5, lte: 9 };
  } else if (stock === 'LOW') {
    return { gte: 1, lte: 4 };
  } else if (stock === 'OUT_OF_STOCK') {
    return 0;
  }
}

@Injectable()
export class InventoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
    private readonly updateInventoryItemProvider: UpdateInventoryItemProvider,
  ) {}

  public async create(createInventoryItemDto: CreateInventoryItemDto) {
    const inventoryItem = await this.prismaService.inventory.create({
      data: createInventoryItemDto,
    });

    return this.responseFormatterService.formatSuccessResponse(
      inventoryItem,
      'Inventory item created successfully',
    );
  }

  public async findAll(
    page: number,
    limit: number,
    search: string,
    stock: StockQueryType,
  ) {
    const inventoryItems = await this.prismaService.inventory.findMany({
      where: {
        ...(search
          ? { assetName: { contains: search, mode: 'insensitive' } }
          : {}),
        ...(stock ? { stock: stockQuery(stock) } : {}),
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        uid: true,
        assetName: true,
        price: true,
        stock: true,
        description: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalItems = await this.prismaService.inventory.count({
      where: {
        ...(search
          ? { assetName: { contains: search, mode: 'insensitive' } }
          : {}),
        ...(stock ? { stock: stockQuery(stock) } : {}),
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      inventoryItems,
      page,
      limit,
      totalItems,
    );
  }

  public async findOne(uid: string) {
    const inventoryItem = await this.prismaService.inventory.findUnique({
      where: { uid },
    });
    return this.responseFormatterService.formatSuccessResponse(
      inventoryItem,
      'Inventory item retrieved successfully',
    );
  }

  public async update(
    uid: string,
    adminUid: string,
    patchInventoryDto: PatchInventoryLogDto,
  ) {
    const result = await this.updateInventoryItemProvider.execute(
      uid,
      adminUid,
      patchInventoryDto,
    );

    return this.responseFormatterService.formatSuccessResponse(
      result,
      'Inventory item updated successfully',
    );
  }

  public async getInventoryLogs(uid: string, type: InventoryLogType) {
    console.log(
      type !== 'DISPATCH'
        ? { changeType: 'DISPATCH' }
        : {
            changeType: {
              not: 'DISPATCH',
            },
          },
    );

    const logs = await this.prismaService.inventoryLog.findMany({
      where: {
        inventoryUid: uid,
        ...(type === 'DISPATCH'
          ? { changeType: 'DISPATCH' }
          : {
              changeType: {
                not: 'DISPATCH',
              },
            }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return this.responseFormatterService.formatSuccessResponse(
      logs,
      'Inventory logs retrieved successfully',
    );
  }
}
