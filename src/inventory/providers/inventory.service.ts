import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryItemDto } from '../dtos/create-inventory-item.dto';
import { StockQueryType } from '../inventory.controller';

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
}
