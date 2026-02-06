import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Status } from 'src/generated/prisma/enums';
import { ClientsService } from './providers/clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { CreateBulkClientsDto } from './dtos/create-bulk-clients.dto';
import UpdateClientDto from './dtos/update-client.dto';

@Controller('clients')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  getAllClients(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('status', new DefaultValuePipe(Status.ACTIVE)) status: Status,
    @Query('zoneUid', new ParseUUIDPipe({ optional: true })) zoneUid?: string,
  ) {
    return this.clientsService.getAll(page, limit, search, status, zoneUid);
  }

  @Post('/bulk')
  createClientsBulk(@Body() createBulkClientsDto: CreateBulkClientsDto) {
    return this.clientsService.createBulk(createBulkClientsDto);
  }

  @Get('/bulk')
  getBulkClients() {
    return this.clientsService.getBulk();
  }

  @Get('/stats')
  getClientStats() {
    return this.clientsService.getClientStats();
  }

  @Get(':uid')
  getClientById(@Param('uid') uid: string) {
    return this.clientsService.findOne(uid);
  }

  @Get(':uid/payments')
  getClientPayments(
    @Param('uid') uid: string,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year?: number,
  ) {
    return this.clientsService.getPaymentsByClientUid(uid, year);
  }

  @Patch(':uid')
  updateClient(
    @Param('uid') uid: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    // Implementation for updating a client by ID goes here
    return this.clientsService.updateByUid(uid, updateClientDto);
  }

  @Delete(':uid')
  deleteClient(@Param('uid') uid: string) {
    return this.clientsService.deleteOne(uid);
  }
}
