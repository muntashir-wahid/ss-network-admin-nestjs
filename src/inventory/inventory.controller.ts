import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateInventoryItemDto } from './dtos/create-inventory-item.dto';
import { InventoryService } from './providers/inventory.service';
import { Role } from 'src/generated/prisma/enums';

export type StockQueryType =
  | 'IN_STOCK'
  | 'LOW'
  | 'ALL'
  | 'MEDIUM'
  | 'OUT_OF_STOCK';

@Controller('inventory')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Post()
  createInventoryItem(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createInventoryItemDto);
  }

  @Get()
  getAllInventoryItems(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('stock', new DefaultValuePipe('')) stock: StockQueryType,
  ) {
    return this.inventoryService.findAll(page, limit, search, stock);
  }

  @Get(':uid')
  getInventoryItemById(@Param('uid') uid: string) {
    return this.inventoryService.findOne(uid);
  }
}
