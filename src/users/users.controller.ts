import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('users')
@Roles(Role.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser() {
    return this.usersService.create();
  }

  @Get('')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':uid')
  getUserById(@Param('uid') uid: string) {
    console.log('Received UID in controller:', uid);
    return this.usersService.findById(uid);
  }
}
