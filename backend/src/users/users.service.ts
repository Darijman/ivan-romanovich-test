import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from 'src/auth/registerUser.dto';
import { ReqUser } from 'src/interfaces/ReqUser';
import { UserRole } from 'src/userRoles/userRole.entity';
import { UserRoles } from 'src/userRoles/userRoles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async createNewUser(registerUserDto: RegisterUserDto): Promise<User> {
    const allRoles = await this.userRolesRepository.find();
    const userRole = allRoles.find((role) => role.name === UserRoles.USER);

    if (!userRole) {
      throw new BadRequestException({ error: 'Something went wrong while signing up!' });
    }

    const user = this.usersRepository.create({ ...registerUserDto, roleId: userRole.id });
    return this.usersRepository.save(user);
  }

  async getUserById(userId: number): Promise<User> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async deleteUserById(userId: number, reqUser: ReqUser): Promise<{ success: boolean }> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    if (reqUser.id !== userId) {
      throw new NotFoundException({ error: 'You do not have permission to delete this user!' });
    }

    await this.usersRepository.delete(userId);
    return { success: true };
  }
}
