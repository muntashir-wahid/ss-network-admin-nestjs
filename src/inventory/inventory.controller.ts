import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/browser';
import { CreateInventoryItemDto } from './dtos/create-inventory-item.dto';
import { InventoryService } from './providers/inventory.service';

@Controller('inventory')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Post()
  createInventoryItem(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createInventoryItemDto);
  }

  @Get()
  getAllInventoryItems() {
    return this.inventoryService.findAll();
  }

  @Get(':uid')
  getInventoryItemById(@Param('uid') uid: string) {
    return this.inventoryService.findOne(uid);
  }
}
