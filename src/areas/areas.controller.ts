import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { AreasService } from './providers/areas.service';
import { UpdateAreaDto } from './providers/dtos/update-area.dto';

@Controller('areas')
@Roles(Role.SUPER_ADMIN)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Patch(':uid')
  updateArea(@Param('uid') uid: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.updateByUid(uid, updateAreaDto);
  }

  @Delete(':uid')
  deleteArea(@Param('uid') uid: string) {
    return this.areasService.deleteByUid(uid);
  }
}
