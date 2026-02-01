import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Status } from 'src/generated/prisma/enums';
import { ClientsService } from './providers/clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { CreateBulkClientsDto } from './dtos/create-bulk-clients.dto';

@Controller('clients')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Post('/bulk')
  createClientsBulk(@Body() createBulkClientsDto: CreateBulkClientsDto) {
    return this.clientsService.createBulk(createBulkClientsDto);
  }

  @Get()
  getAllClients(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('status', new DefaultValuePipe(Status.ACTIVE)) status: Status,
    // @Query('zone', ParseUUIDPipe) zone?: string,
  ) {
    // Implementation for fetching all clients goes here
    return this.clientsService.getAll(page, limit, search, status, '');
  }

  @Get(':id')
  getClientById() {
    // Implementation for fetching a client by ID goes here
    return {
      message: 'Fetch client by ID logic not yet implemented',
    };
  }

  @Patch(':id')
  updateClient() {
    // Implementation for updating a client by ID goes here
    return {
      message: 'Update client logic not yet implemented',
    };
  }

  @Delete(':id')
  deleteClient() {
    // Implementation for deleting a client by ID goes here
    return {
      message: 'Delete client logic not yet implemented',
    };
  }
}
