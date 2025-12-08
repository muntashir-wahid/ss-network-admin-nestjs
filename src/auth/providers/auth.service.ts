import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { BcryptProvider } from './bcrypt.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptProvider: BcryptProvider,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async login() {
    const user = await this.usersService.findByEmail('example@example2.com');

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordValid = await this.bcryptProvider.comparePassword(
      'securepassword',
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.uid,
      email: user.email,
      role: user.role,
    });

    return { status: 'success', data: { accessToken } };
  }
}
