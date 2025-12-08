import { PickType } from '@nestjs/swagger';
import { CreateAdminUserDto } from 'src/users/dtos/create-admin-user.dto';

export class LoginDto extends PickType(CreateAdminUserDto, [
  'email',
  'password',
] as const) {}
