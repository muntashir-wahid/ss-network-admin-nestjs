import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AreasService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
  ) {}
  async deleteByUid(uid: string) {
    const area = await this.prismaService.area.delete({
      where: { uid },
    });
    // Placeholder for delete logic
    return this.responseFormatterService.formatSuccessResponse(
      area,
      'Area deleted successfully',
    );
  }
}
