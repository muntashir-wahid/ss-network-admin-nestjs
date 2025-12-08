import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => BcryptProvider))
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  public async create() {
    const user = await this.prismaService.user.create({
      data: {
        email: 'example@example2.com',
        name: 'Example User 2',
        password: await this.bcryptProvider.hashPassword('securepassword'),
      },
    });

    return user;
  }

  public async findAll() {
    return this.prismaService.user.findMany();
  }

  public async findById(uid: string) {
    console.log('Finding user by ID:', uid);
    return this.prismaService.user.findUnique({
      where: {
        uid: uid,
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
