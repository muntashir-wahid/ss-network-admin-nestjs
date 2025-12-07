import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';

@Controller('users')
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
