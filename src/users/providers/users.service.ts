import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create() {
    const user = await this.prismaService.user.create({
      data: {
        email: 'example@example.com',
        name: 'Example User',
        password: 'securepassword',
      },
    });

    return user;
  }
}
