import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './userRole.entity';
import { UserRolesService } from './userRoles.service';
import { UserRolesController } from './userRoles.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), UsersModule, forwardRef(() => AuthModule)],
  providers: [UserRolesService],
  controllers: [UserRolesController],
})
export class UsersRolesModule {}
