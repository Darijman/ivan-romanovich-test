import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './userRole.entity';
import { CreateUserRoleDto } from './createUserRole.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  async getAllUserRoles(): Promise<UserRole[]> {
    return await this.userRolesRepository.find();
  }

  async createNewUserRole(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    const userRole = this.userRolesRepository.create(createUserRoleDto);
    return await this.userRolesRepository.save(userRole);
  }

  async getUserRoleById(roleId: number): Promise<UserRole> {
    if (!roleId || isNaN(roleId)) {
      throw new BadRequestException({ error: 'Invalid role ID!' });
    }

    const role = await this.userRolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({ error: 'Role not found!' });
    }
    return role;
  }

  async deleteUserRoleById(roleId: number): Promise<{ success: boolean }> {
    if (!roleId || isNaN(roleId)) {
      throw new BadRequestException({ error: 'Invalid role ID!' });
    }

    const role = await this.userRolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({ error: 'Role not found!' });
    }

    await this.userRolesRepository.delete(roleId);
    return { success: true };
  }
}
