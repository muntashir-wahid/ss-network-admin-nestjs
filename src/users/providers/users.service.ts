import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { PrismaService } from 'src/prisma.service';
import { CreateAdminUserDto } from '../dtos/create-admin-user.dto';
import { UpdateAdminUserDto } from '../dtos/update-admin-user.dto';
import { ResponseFormatterService } from 'src/common/response-formatter/response-formatter.service';
import { RoleQueryType, StatusQueryType } from '../users.controller';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseFormatterService: ResponseFormatterService,

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

    return this.responseFormatterService.formatSuccessResponse(
      user,
      'User created successfully',
    );
  }

  public async findAll(
    currentUserId: string,
    page: number,
    limit: number,
    role: RoleQueryType,
    search: string,
    status: StatusQueryType,
  ) {
    const users = await this.prismaService.user.findMany({
      where: {
        uid: {
          not: currentUserId,
        },
        ...(role !== 'ALL' ? { role: role } : {}),
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(status !== 'ALL' ? { status: status } : {}),
      },
      select: {
        uid: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const totalUsers = await this.prismaService.user.count({
      where: {
        uid: {
          not: currentUserId,
        },
      },
    });

    return this.responseFormatterService.formatPaginatedResponse(
      users,
      page,
      limit,
      totalUsers,
    );
  }

  public async findById(uid: string) {
    const user = await this.prismaService.user.findUnique({
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

    return this.responseFormatterService.formatSuccessResponse(user);
  }

  public async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
        status: 'ACTIVE',
      },
    });
  }

  public async update(uid: string, updateUserDto: UpdateAdminUserDto) {
    const payload = {
      ...updateUserDto,
    };

    delete payload.password;

    const updatedUser = await this.prismaService.user.update({
      where: {
        uid: uid,
      },
      data: payload,
      select: {
        uid: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    return this.responseFormatterService.formatSuccessResponse(
      updatedUser,
      'User updated successfully',
    );
  }
}
