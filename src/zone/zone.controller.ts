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
import { Role } from 'src/generated/prisma/enums';
import { ZoneService } from './providers/zone.service';
import { CreateZoneDto } from './dtos/create-zone.dto';
import { UpdateZoneDto } from './dtos/update-zone.dto';

@Controller('zones')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  getAllZones(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.zoneService.findAll(page, limit);
  }

  @Get(':uid')
  getZoneByUid(@Param('uid') uid: string) {
    return this.zoneService.findByUid(uid);
  }

  @Patch(':uid')
  updateZone(@Param('uid') uid: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zoneService.updateByUid(uid, updateZoneDto);
  }
}
