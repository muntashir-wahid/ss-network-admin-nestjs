import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { CreateInventoryItemDto } from '../dtos/create-inventory-item.dto';

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

  public async findAll() {
    const inventoryItems = await this.prismaService.inventory.findMany({
      select: {
        uid: true,
        assetName: true,
        price: true,
        stock: true,
        description: true,
      },
    });
    const totalItems = await this.prismaService.inventory.count();

    return this.responseFormatterService.formatPaginatedResponse(
      inventoryItems,
      1,
      10,
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
