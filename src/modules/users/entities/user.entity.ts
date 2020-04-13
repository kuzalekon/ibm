import { Transform, Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Role, RoleType } from './role.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 64 })
  name: string;

  @ApiProperty()
  @Column({ length: 32, unique: true })
  login: string;

  @Column({ length: 64 })
  @Exclude()
  password: string;

  @ApiPropertyOptional({ enum: RoleType })
  @ManyToMany(
    () => Role,
    role => role.users,
  )
  @JoinTable()
  @Transform(roles => roles.map(role => role.name))
  roles: Role[];

  @ApiProperty({ type: 'string' })
  @ManyToOne(
    () => Organization,
    organization => organization.users,
  )
  @Transform(organization => organization.name)
  organization: Organization;
}
