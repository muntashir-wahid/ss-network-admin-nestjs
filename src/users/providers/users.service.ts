import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { PrismaService } from 'src/prisma.service';
import { CreateAdminUserDto } from '../dtos/create-admin-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => BcryptProvider))
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  public async create(createUserDto: CreateAdminUserDto) {
    const payload = {
      email: createUserDto.email,
      name: createUserDto.name,
      password: await this.bcryptProvider.hashPassword(createUserDto.password),
      role: createUserDto.role || 'ADMIN',
    };

    const user = await this.prismaService.user.create({
      data: payload,
    });

    return user;
  }

  public async findAll() {
    return this.prismaService.user.findMany({
      select: {
        uid: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public async findById(uid: string) {
    console.log('Finding user by ID:', uid);
    return this.prismaService.user.findUnique({
      where: {
        uid: uid,
      },
      select: {
        uid: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
