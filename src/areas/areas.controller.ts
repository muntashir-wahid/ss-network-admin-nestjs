import { Controller, Delete, Param } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { AreasService } from './providers/areas.service';

@Controller('areas')
@Roles(Role.SUPER_ADMIN)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Delete(':uid')
  deleteArea(@Param('uid') uid: string) {
    return this.areasService.deleteByUid(uid);
  }
}
