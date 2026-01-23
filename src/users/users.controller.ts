import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CreateAdminUserDto } from './dtos/create-admin-user.dto';
import { UpdateAdminUserDto } from './dtos/update-admin-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

export type RoleQueryType = 'ADMIN' | 'SUPER_ADMIN' | 'ALL';
export type StatusQueryType = 'ACTIVE' | 'DISABLED' | 'ALL';

@Controller('users')
@Roles(Role.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateAdminUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('')
  getAllUsers(
    @CurrentUser('sub') uid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role', new DefaultValuePipe('ALL'))
    role: RoleQueryType,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('status', new DefaultValuePipe('ALL')) status: StatusQueryType,
  ) {
    return this.usersService.findAll(uid, page, limit, role, search, status);
  }

  @Get(':uid')
  getUserById(@Param('uid') uid: string) {
    return this.usersService.findById(uid);
  }

  @Patch(':uid')
  updateUser(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateAdminUserDto,
  ) {
    return this.usersService.update(uid, updateUserDto);
  }
}
