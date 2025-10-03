import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserRole } from './userRoles/userRole.entity';
import { UsersRolesModule } from './userRoles/userRoles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('MYSQL_ROOT_PASSWORD'),
        database: config.get('MYSQL_DATABASE'),
        entities: [User, UserRole],
        synchronize: true,
        timezone: 'Z',
      }),
    }),
    UsersRolesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
