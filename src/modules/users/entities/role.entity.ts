import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from 'typeorm';
import { User } from './user.entity';

export enum RoleType {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  name: string;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users: User[];
}
