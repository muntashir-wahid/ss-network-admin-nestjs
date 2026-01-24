import { Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/browser';

@Controller('inventory')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class InventoryController {
  @Post()
  createInventoryItem() {
    return { message: 'Inventory item created' };
  }

  @Get()
  getAllInventoryItems() {
    return { message: 'List of all inventory items' };
  }

  @Get(':uid')
  getInventoryItemById() {
    return { message: 'Inventory item details' };
  }
}
