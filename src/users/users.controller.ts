import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CreateAdminUserDto } from './dtos/create-admin-user.dto';

@Controller('users')
@Roles(Role.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateAdminUserDto) {
    return this.usersService.create(createUserDto);
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
