import { Injectable } from '@nestjs/common';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { PrismaService } from 'src/prisma.service';
import { UpdateAreaDto } from './dtos/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,
  ) {}
  public async updateByUid(uid: string, updateAreaDto: UpdateAreaDto) {
    const area = await this.prismaService.area.update({
      where: { uid },
      data: updateAreaDto,
    });

    return this.responseFormatterService.formatSuccessResponse(
      area,
      'Area updated successfully',
    );
  }

  public async deleteByUid(uid: string) {
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
