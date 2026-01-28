import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { ClientsService } from './providers/clients.service';
import { CreateClientDto } from './dtos/create-client.dto';

@Controller('clients')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  getAllClients() {
    // Implementation for fetching all clients goes here
    return this.clientsService.getAll();
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
