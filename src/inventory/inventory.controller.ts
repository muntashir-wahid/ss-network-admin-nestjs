import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateInventoryItemDto } from './dtos/create-inventory-item.dto';
import { InventoryService } from './providers/inventory.service';
import { Role } from 'src/generated/prisma/enums';
import { PatchInventoryLogDto } from './dtos/patch-inventory-item.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

export type StockQueryType =
  | 'IN_STOCK'
  | 'LOW'
  | 'ALL'
  | 'MEDIUM'
  | 'OUT_OF_STOCK';

export type InventoryLogType = 'DISPATCH' | 'UPDATE';

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

  @Get('stats')
  getInventoryStats() {
    return this.inventoryService.getStats();
  }

  @Get(':uid')
  getInventoryItemById(@Param('uid') uid: string) {
    return this.inventoryService.findOne(uid);
  }

  @Patch(':uid')
  updateInventoryItem(
    @CurrentUser('sub') adminUid: string,
    @Param('uid') uid: string,
    @Body() patchInventoryDto: PatchInventoryLogDto,
  ) {
    return this.inventoryService.update(uid, adminUid, patchInventoryDto);
  }

  @Get(':uid/logs')
  getInventoryItemLogs(
    @Param('uid') uid: string,
    @Query('type', new DefaultValuePipe('DISPATCH')) type: InventoryLogType,
  ) {
    return this.inventoryService.getInventoryLogs(uid, type);
  }
}
