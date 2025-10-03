import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRoles } from './userRoles.enum';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'enum', enum: UserRoles, unique: true })
  name: UserRoles;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
