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

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findById(uid: string) {
    console.log('Finding user by ID:', uid);
    return this.prismaService.user.findUnique({
      where: {
        uid: uid,
      },
    });
  }
}
