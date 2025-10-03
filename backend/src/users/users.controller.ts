import { Controller, Get, Param, UseInterceptors, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CustomParseIntPipe } from 'src/common/pipes/customParseIntPipe/CustomParseIntPipe';
import { RolesGuard } from 'src/guards/rolesGuard/roles.guard';
import { UserRoles } from 'src/userRoles/userRoles.enum';
import { Roles } from 'src/guards/rolesGuard/roles.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getUserById(@Param('userId', new CustomParseIntPipe('User ID')) userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':userId')
  async deleteUserById(
    @Param('userId', new CustomParseIntPipe('User ID')) userId: number,
    @Req() req: Request,
  ): Promise<{ success: boolean }> {
    return await this.usersService.deleteUserById(userId, req.user);
  }
}
