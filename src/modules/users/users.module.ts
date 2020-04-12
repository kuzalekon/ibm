import { Module } from '@nestjs/common';
import { OrganizationsRepository } from '../users/repositories/origanizations.repository';
import { RolesRepository } from '../users/repositories/roles.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../ifaces/http/controllers/users.controller';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UsersRepository, OrganizationsRepository, RolesRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
