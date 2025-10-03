import { Controller, Get, Param, UseInterceptors, Delete, UseGuards, Post } from '@nestjs/common';
import { UserRole } from './userRole.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomParseIntPipe } from 'src/common/pipes/customParseIntPipe/CustomParseIntPipe';
import { UserRolesService } from './userRoles.service';
import { CreateUserRoleDto } from './createUserRole.dto';
import { RolesGuard } from 'src/guards/rolesGuard/roles.guard';
import { Roles } from 'src/guards/rolesGuard/roles.decorator';
import { UserRoles } from './userRoles.enum';

@Controller('user_roles')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  async getAllUserRoles(): Promise<UserRole[]> {
    return await this.userRolesService.getAllUserRoles();
  }

  @Get(':roleId')
  @Roles(UserRoles.ADMIN)
  async getUserRoleById(@Param('roleId', new CustomParseIntPipe('Role ID')) roleId: number): Promise<UserRole> {
    return await this.userRolesService.getUserRoleById(roleId);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  async createNewUserRole(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    return await this.userRolesService.createNewUserRole(createUserRoleDto);
  }

  @Delete(':roleId')
  @Roles(UserRoles.ADMIN)
  async deleteUserRoleById(@Param('roleId', new CustomParseIntPipe('Role ID')) roleId: number): Promise<{ success: boolean }> {
    return await this.userRolesService.deleteUserRoleById(roleId);
  }
}
